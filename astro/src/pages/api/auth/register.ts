import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../utils/types.ts';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;
  const pwdConfirmation = formData.get('password_confirmation') as string | null;

  if (!username || !password) {
    cookies.set('feedback', 'user_pass_req', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/register');
  }

  if (password !== pwdConfirmation) {
    cookies.set('feedback', 'pass_no_match', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/register');
  }

  if (password.length < 8) {
    cookies.set('feedback', 'pass_too_short', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/register');
  }

  const userStore = getStore({ name: 'User', consistency: 'strong' });

  const userStoreList = await userStore.list();
  const allUsers = await Promise.all(
    userStoreList.blobs.map(async (blob) => {
      const user = await userStore.get(blob.key, { type: 'json' });
      return user;
    }),
  );
  const userExists = allUsers.some((user) => user.username === username);

  if (userExists) {
    cookies.set('feedback', 'user_exists', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict'
    });
    return redirect('/register');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const uuid = uuidv4();
  const user: User = {
    id: uuid,
    username,
    password: passwordHash,
    avatarSrc: `/images/avatar/identicon/${username}`,
  };

  await userStore.setJSON(uuid, user);

  if (!process.env.COOKIE_JWT_SECRET) {
    throw new Error('Missing COOKIE_JWT_SECRET environment variable');
  }
  const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

  const jwt = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(secret);

  cookies.set('blink_session', jwt, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict'
  });

  cookies.set('feedback', 'user_created', {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 5,
    sameSite: 'strict'
  });
  
  return redirect('/');
};