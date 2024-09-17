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
  <title>{{ title }} | Blink</title>

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
  "new-post-form": `<form action="/api/posts/create" method="post">
  <input type="text" name="title" placeholder="Title" required minlength="10" maxlength="64" />
  <div>
    <textarea
      id="new-post-content"
      name="content"
      placeholder="Content"
      minlength="10"
      maxlength="400"
      required
    ></textarea>
    <div id="new-post-remaining-count">400</div>
  </div>
  <button type="submit">Post</button>
</form>

<script>
  const textarea = document.getElementById('new-post-content')
  const charCount = document.getElementById('new-post-remaining-count')
  const maxLength = parseInt(textarea.getAttribute('maxlength'), 10)

  textarea.addEventListener('input', () => {
    const remaining = maxLength - textarea.value.length
    charCount.textContent = remaining

    // Reset classes
    charCount.classList.remove('warning', 'danger')

    // Apply color based on remaining characters
    if (remaining < 5) {
      charCount.classList.add('danger')
    } else if (remaining < 20) {
      charCount.classList.add('warning')
    }
  })
</script>
`,
  "post-card": `<div>
  <h3><a href="/post/{{ postId }}">{{ title }}</a></h3>
  <div>{{ content }}</div>
  <a href="/@{{ username }}">
    <img class="avatar" src="{{ avatarSrc }}" alt="{{ username }} avatar" />
    <span>{{ username }}</span>
  </a>
  <div>{{ date }}</div>
</div>
`,
  "post-detail": `<!doctype html>
<html lang="en">
  <partial name="head" title="{{ title }}"></partial>
  <body>
    <partial name="header"></partial>
    <feedback></feedback>

    <div>
      <h2>{{ title }}</h2>
      <div>{{ content }}</div>
      <a href="/@{{ username }}">
        <img class="avatar" src="{{ avatarSrc }}" alt="{{ username }} avatar" />
        <span>{{ username }}</span>
      </a>
      <div>{{ date }}</div>
    </div>
  </body>
</html>
`,
  "profile-no-posts": `<div>No posts from this user yet.</div>
`,
  profile: `<!doctype html>
<html lang="en">
  <partial name="head" title="{{ username }} Profile"></partial>
  <body>
    <partial name="header"></partial>
    <feedback></feedback>

    <h1>{{ username }} Profile</h1>

    <div>
      <h2>My latest posts</h2>
      {{ posts }}
    </div>
  </body>
</html>
`,
};

export type PartialName = keyof typeof partials;
