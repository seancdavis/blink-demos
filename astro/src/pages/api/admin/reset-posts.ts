import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { clearPostsIndex } from '../../../utils/posts-index.ts';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const apiKey = formData.get('api_key') as string;

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  const postStore = getStore({ name: 'Post', consistency: 'strong' });
  const allPostIds = (await postStore.list()).blobs.map(({ key }) => key);
  await Promise.all(allPostIds.map((id) => postStore.delete(id)));
  await clearPostsIndex();

  return new Response('All posts deleted successfully');
};