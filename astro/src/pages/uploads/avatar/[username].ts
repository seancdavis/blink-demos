import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { getUserByUsername } from '../../../utils/get-user-by-username.mts';

export const GET: APIRoute = async ({ params }) => {
  const avatarUsername = params.username?.split('.')[0];

  if (!avatarUsername) {
    return new Response('Not Found', { status: 404 });
  }

  const user = await getUserByUsername(avatarUsername);
  if (!user || user.avatarSrc === '/images/default-avatar.jpg') {
    return new Response('Not Found', { status: 404 });
  }

  const userAvatarStore = getStore({ name: 'UserAvatar', consistency: 'strong' });
  const userAvatarBlob = await userAvatarStore.get(user.username.toString(), {
    type: 'stream',
  });

  return new Response(userAvatarBlob);
};