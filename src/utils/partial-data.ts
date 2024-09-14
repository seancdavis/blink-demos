export const partials = {
  __undefined__: `<div>PARTIAL_NOT_FOUND</div>
`,
  "auth-links-signed-in": `<a href="/profile">
  <!-- TODO: Add avatar image here -->
  <span>{{ username }}</span>
</a>
<a href="/settings">Edit profile</a>
<form action="/api/auth/logout" method="post">
  <button type="submit">Sign out</button>
</form>
`,
  "auth-links-signed-out": `<a href="/login">Sign in</a>
`,
  feedback: `<div class="{{ classname }}">{{ message }}</div>
`,
  head: `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ title }} | U</title>
</head>
`,
  header: `<header>
  <h1>My Site</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <auth-links></auth-links>
  </nav>
</header>
`,
};

export type PartialName = keyof typeof partials;
