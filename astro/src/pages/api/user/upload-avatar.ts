import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { getCurrentUser } from '../../../utils/get-current-user.mts';

// Adapted getCurrentUser for Astro cookies
async function getCurrentUserAstro(cookies: any) {
  const sessionCookie = cookies.get('blink_session')?.value;
  if (!sessionCookie) return null;

  try {
    const { decodeJwt } = await import('jose');
    const decodedJwt = decodeJwt(sessionCookie);
    
    if (!decodedJwt) return null;

    const userStore = getStore({ name: 'User', consistency: 'strong' });
    const userBlob = await userStore.get(decodedJwt.id as string, { type: 'json' });

    if (!userBlob) return null;

    const userMatches =
      userBlob &&
      userBlob.username === decodedJwt.username &&
      userBlob.id === decodedJwt.id &&
      userBlob.password === decodedJwt.password;

    if (!userMatches) return null;

    return userBlob;
  } catch (_err: unknown) {
    return null;
  }
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Get current user
  const user = await getCurrentUserAstro(cookies);

  // Check authentication
  if (!user) {
    cookies.set('feedback', 'auth_required', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/login');
  }

  const formData = await request.formData();
  const image = formData.get('avatar') as File;

  // Validate file exists
  if (!image || !image.size) {
    cookies.set('feedback', 'avatar_required', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/settings');
  }

  // Validate file size (2 MB limit)
  const maxSizeBytes = 2 * 1024 * 1024; // 2 MB
  if (image.size > maxSizeBytes) {
    cookies.set('feedback', 'avatar_too_large', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/settings');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(image.type)) {
    cookies.set('feedback', 'avatar_invalid_type', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/settings');
  }

  // Store the avatar image in the UserAvatar store
  const userAvatarStore = getStore({ name: 'UserAvatar', consistency: 'strong' });
  await userAvatarStore.set(user.username.toString(), image);

  // Update the user blob with the new avatar URL
  const userStore = getStore({ name: 'User', consistency: 'strong' });
  user.avatarSrc = `/images/avatar/small/${user.username}`;
  await userStore.setJSON(user.id, user);

  cookies.set('feedback', 'avatar_uploaded', {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 5,
    sameSite: 'strict'
  });
  
  return redirect('/settings');
};