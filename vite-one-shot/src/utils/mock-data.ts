import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import type { User, Post, PostWithUser } from "./types";
import { timeAgoInWords } from "./time-ago-in-words";

export function generateMockUsers(count: number = 10): User[] {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const userId = uuidv4();
    users.push({
      id: userId,
      username: faker.internet.username(),
      password: faker.internet.password(),
      avatarSrc: `https://api.dicebear.com/7.x/identicon/png?seed=${userId}`,
    });
  }

  return users;
}

export function generateMockPosts(users: User[], count: number = 50): Post[] {
  const posts: Post[] = [];

  for (let i = 0; i < count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Random date within last 30 days
    );

    posts.push({
      id: uuidv4(),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      content: faker.lorem.paragraphs({ min: 1, max: 3 }, '\n\n'),
      userId: randomUser.id,
      createdAt: createdAt.toISOString(),
    });
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addUserDataToPosts(posts: Post[], users: User[]): PostWithUser[] {
  return posts.map(post => {
    const user = users.find(u => u.id === post.userId);
    if (!user) {
      throw new Error(`User not found for post ${post.id}`);
    }

    return {
      ...post,
      user: { ...user, password: '' }, // Don't expose password
      date: timeAgoInWords(new Date(post.createdAt)),
    };
  });
}