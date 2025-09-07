import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { newlineToLineBreak } from '../../../utils/index.mts';
import { renderPartial } from '../../../utils/render-partial.mts';
import { timeAgoInWords } from '../../../utils/time-ago-in-words.mts';

export const GET: APIRoute = async ({ params }) => {
  const postId = params.id;

  if (!postId || postId.length === 0) {
    const html = renderPartial({ name: 'not-found' });
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=31536000',
      },
    });
  }

  const postStore = getStore({ name: 'Post', consistency: 'strong' });
  const userStore = getStore({ name: 'User', consistency: 'strong' });
  const post = await postStore.get(postId, { type: 'json' });

  if (!post) {
    const html = renderPartial({ name: 'not-found' });
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=31536000',
        'Netlify-Cache-Tag': postId,
      },
    });
  }

  const date = timeAgoInWords(new Date(post.createdAt));
  const user = await userStore.get(post.userId, { type: 'json' });

  const html = renderPartial({
    name: 'post-detail',
    data: { ...post, ...user, date, content: newlineToLineBreak(post.content) },
  });

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=31536000',
      'Netlify-Cache-Tag': post.id,
    },
  });
};