export const partials = {
  __undefined__: `<div>PARTIAL_NOT_FOUND</div>
`,
  "auth-links-signed-in": `<a href="/@{{ username }}">
  <img class="avatar" src="{{ avatarSrc }}" alt="{{ username }} avatar" />
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

  <link rel="stylesheet" href="/css/base.css" />
  <link rel="stylesheet" href="/css/components.css" />
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
  "post-card": `<div>
  <h3>{{ title }}</h3>
  <div>{{ content }}</div>
  <a href="/@{{ username }}">
    <img class="avatar" src="{{ avatarSrc }}" alt="{{ username }} avatar" />
    <span>{{ username }}</span>
  </a>
  <div>{{ date }}</div>
</div>
`,
  profile: `<!doctype html>
<html lang="en">
  <partial name="head" title="Login"></partial>
  <body>
    <partial name="header"></partial>
    <feedback></feedback>

    <h1>{{ username }}</h1>

    <div>Posts go here ...</div>
  </body>
</html>
`,
};

export type PartialName = keyof typeof partials;
