import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { User } from '../../../utils/types.ts';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  if (!username || !password) {
    cookies.set('feedback', 'user_pass_req', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/login');
  }

  const userStore = getStore({ name: 'User', consistency: 'strong' });

  const allUsers = await userStore.list();
  let userId: string | null = null;
  for (const blob of allUsers.blobs) {
    const user: User = await userStore.get(blob.key, { type: 'json' });
    if (user.username === username) {
      userId = blob.key;
      break;
    }
  }

  if (!userId) {
    cookies.set('feedback', 'user_pass_error', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/login');
  }

  const userBlob: User = await userStore.get(userId, { type: 'json' });
  const passwordValid = await bcrypt.compare(password, userBlob.password);

  if (!passwordValid) {
    cookies.set('feedback', 'user_pass_error', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/login');
  }

  if (!process.env.COOKIE_JWT_SECRET) {
    throw new Error('Missing COOKIE_JWT_SECRET environment variable');
  }
  const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

  const jwt = await new SignJWT(userBlob)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(secret);

  cookies.set('blink_session', jwt, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict'
  });

  cookies.set('feedback', 'login_success', {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 5,
    sameSite: 'strict'
  });
  
  return redirect('/');
};