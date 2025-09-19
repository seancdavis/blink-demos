import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// Predefined users for consistent seeding
const SEED_USERS = [
  {
    username: "alice_dev",
    displayName: "Alice Johnson",
    bio: "Full-stack developer passionate about React and TypeScript",
  },
  {
    username: "bob_design",
    displayName: "Bob Smith",
    bio: "UI/UX designer creating beautiful digital experiences",
  },
  {
    username: "charlie_writer",
    displayName: "Charlie Brown",
    bio: "Content creator and technical writer",
  },
  {
    username: "diana_data",
    displayName: "Diana Rodriguez",
    bio: "Data scientist exploring AI and machine learning",
  },
  {
    username: "evan_mobile",
    displayName: "Evan Chen",
    bio: "Mobile app developer building the future",
  },
];

// Sample post topics for more realistic content
const POST_TOPICS = [
  {
    title: "Getting Started with React 19",
    content: "React 19 introduces some amazing new features that make development even more enjoyable. The new compiler optimizations and improved hydration make apps faster than ever.\n\nI've been testing it in production and the performance gains are noticeable. The automatic memoization is a game-changer for complex components.",
  },
  {
    title: "The Future of Web Development",
    content: "Web development is evolving rapidly with new frameworks, tools, and paradigms emerging constantly.\n\nFrom server components to edge computing, we're seeing a shift towards more performant and developer-friendly solutions. What trends are you most excited about?",
  },
  {
    title: "Building Accessible User Interfaces",
    content: "Accessibility shouldn't be an afterthought in design. By incorporating inclusive design principles from the start, we create better experiences for everyone.\n\nSimple things like proper contrast ratios, semantic HTML, and keyboard navigation can make a huge difference.",
  },
  {
    title: "The Art of Code Reviews",
    content: "Code reviews are more than just finding bugs - they're opportunities for knowledge sharing and team growth.\n\nI've found that focusing on clarity, maintainability, and learning opportunities leads to much more productive discussions than just nitpicking syntax.",
  },
  {
    title: "Debugging Tips That Actually Work",
    content: "After years of debugging, I've learned that the best approach is systematic and methodical.\n\nStart with understanding the expected behavior, then isolate the problem area. Console logs are your friend, but don't forget about browser dev tools and debugger statements.",
  },
  {
    title: "Why TypeScript Changed My Life",
    content: "I was skeptical about TypeScript at first, but now I can't imagine writing JavaScript without it.\n\nThe type safety catches so many bugs before they reach production, and the developer experience with modern IDEs is incredible. Autocomplete and refactoring tools just work.",
  },
  {
    title: "Remote Work Best Practices",
    content: "Working remotely requires discipline and good communication skills. Here are some practices that have helped me stay productive:\n\n• Clear boundaries between work and personal time\n• Regular check-ins with team members\n• Investing in a good home office setup",
  },
  {
    title: "Learning in Public",
    content: "Sharing your learning journey publicly can be scary, but it's incredibly rewarding.\n\nWriting about what you learn helps solidify your understanding, and you'll be surprised how many people find your perspective valuable, even as a beginner.",
  },
  {
    title: "The Power of Open Source",
    content: "Contributing to open source projects has been one of the most rewarding parts of my career.\n\nIt's not just about code - documentation, bug reports, and community support are all valuable contributions. Start small and find projects you actually use.",
  },
  {
    title: "Building Side Projects",
    content: "Side projects are a great way to experiment with new technologies and explore creative ideas.\n\nDon't worry about building the next unicorn startup - focus on solving problems you actually have or building something that brings you joy.",
  },
];

async function clearExistingData(userStore: any, postStore: any) {
  console.log("Clearing existing data...");

  // Clear posts
  const allPosts = await postStore.list();
  for (const blob of allPosts.blobs) {
    try {
      await postStore.delete(blob.key);
    } catch (error) {
      console.error(`Error deleting post ${blob.key}:`, error);
    }
  }

  // Clear users
  const allUsers = await userStore.list();
  for (const blob of allUsers.blobs) {
    try {
      await userStore.delete(blob.key);
    } catch (error) {
      console.error(`Error deleting user ${blob.key}:`, error);
    }
  }

  console.log("Existing data cleared.");
}

async function seedUsers(userStore: any): Promise<string[]> {
  console.log("Creating seed users...");
  const userIds: string[] = [];

  for (const seedUser of SEED_USERS) {
    const userId = uuidv4();
    const userData = {
      username: seedUser.username,
      password: await bcrypt.hash("password123", 10),
      avatarSrc: `https://api.dicebear.com/7.x/identicon/png?seed=${userId}`,
    };

    // Store as text to ensure proper serialization
    await userStore.set(userId, JSON.stringify(userData));
    userIds.push(userId);
    console.log(`Created user: ${userData.username}`);
  }

  return userIds;
}

async function seedPosts(postStore: any, userIds: string[]) {
  console.log("Creating seed posts...");

  // Create posts from predefined topics
  for (let i = 0; i < POST_TOPICS.length; i++) {
    const topic = POST_TOPICS[i];
    const postId = uuidv4();
    const postData = {
      title: topic.title,
      content: topic.content,
      userId: userIds[i % userIds.length], // Distribute posts among users
      createdAt: new Date(
        Date.now() - (POST_TOPICS.length - i) * 2 * 60 * 60 * 1000 // Spread posts over last 20 hours
      ).toISOString(),
    };

    // Store as text to ensure proper serialization
    await postStore.set(postId, JSON.stringify(postData));
    console.log(`Created post: ${topic.title}`);
  }

  // Add some additional random posts for variety
  console.log("Creating additional random posts...");
  for (let i = 0; i < 15; i++) {
    const postId = uuidv4();
    const postData = {
      title: faker.lorem.sentence({ min: 4, max: 8 }).slice(0, 64),
      content: faker.lorem.paragraphs({ min: 2, max: 4 }, '\n\n').slice(0, 400),
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      createdAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 // Random time in last 7 days
      ).toISOString(),
    };

    // Store as text to ensure proper serialization
    await postStore.set(postId, JSON.stringify(postData));

    if (i % 5 === 0) {
      console.log(`Created ${i + 1} additional posts...`);
    }
  }
}

export default async (request: Request) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const clear = url.searchParams.get("clear") === "true";

    const userStore = getStore({ name: "User", consistency: "strong" });
    const postStore = getStore({ name: "Post", consistency: "strong" });

    if (clear) {
      await clearExistingData(userStore, postStore);
    }

    // Check if data already exists
    const existingUsers = await userStore.list();
    const existingPosts = await postStore.list();

    if (existingUsers.blobs.length > 0 && existingPosts.blobs.length > 0 && !clear) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Data already exists. Use ?clear=true to reset and reseed.",
          stats: {
            existingUsers: existingUsers.blobs.length,
            existingPosts: existingPosts.blobs.length,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Seed the database
    const userIds = await seedUsers(userStore);
    await seedPosts(postStore, userIds);

    // Get final counts
    const finalUsers = await userStore.list();
    const finalPosts = await postStore.list();

    console.log("Seeding completed successfully!");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database seeded successfully!",
        stats: {
          usersCreated: finalUsers.blobs.length,
          postsCreated: finalPosts.blobs.length,
        },
        sampleCredentials: {
          username: SEED_USERS[0].username,
          password: "password123",
          note: "All seed users have the same password: password123",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Seed API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: "/api/seed",
};