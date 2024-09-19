export const partials = {
  __undefined__: `<div>PARTIAL_NOT_FOUND</div>
`,
  "auth-links-signed-in": `<details class="header-auth-links signed-in">
  <summary>
    <img class="avatar" src="{{ avatarSrc }}" alt="{{ username }} avatar" />
  </summary>
  <div class="header-auth-links-dropdown">
    <a href="/@{{ username }}">{{ username }}</a>
    <a href="/settings">Edit profile</a>
    <form action="/api/auth/logout" method="post">
      <button class="sign-out" type="submit">Sign out</button>
    </form>
  </div>
</details>
`,
  "auth-links-signed-out": `<a href="/login">Sign in</a>
`,
  feedback: `<div class="{{ classname }}">{{ message }}</div>
`,
  head: `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ title }} | Blink</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,400;0,600;0,800;1,400;1,600;1,800&display=swap"
    rel="stylesheet"
  />

  <link rel="stylesheet" href="/css/styles.css" />
</head>
`,
  header: `<header>
  <div class="header-content container">
    <a class="header-logo" href="/">
      <img src="/images/blink-logo.svg" alt="BLINK Logo" />
    </a>
    <nav>
      <auth-links></auth-links>
    </nav>
  </div>
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
  "not-found": `<!doctype html>
<html lang="en">
  <partial name="head" title="Login"></partial>
  <body>
    <partial name="header"></partial>
    <feedback></feedback>

    <h1>Page not found</h1>
  </body>
</html>
`,
  "post-card": `<div class="post-card">
  <div class="post-card-meta">
    <img class="avatar" src="{{ avatarSrc }}" alt="{{ username }} avatar" />
    <div>
      <a class="post-card-username" href="/@{{ username }}">{{ username }}</a>
      <span class="post-card-date">{{ date }}</span>
    </div>
  </div>
  <div class="post-card-content">
    <h3 class="post-card-title"><a href="/post/{{ postId }}">{{ title }}</a></h3>
    <div>{{ content }}</div>
  </div>
</div>
`,
  "post-detail": `<!doctype html>
<html lang="en">
  <partial name="head" title="{{ title }}"></partial>
  <body>
    <partial name="header"></partial>
    <feedback></feedback>

    <main>
      <div class="post-detail container-sm">
        <div class="post-detail-meta">
          <img class="avatar" src="{{ avatarSrc }}" alt="{{ username }} avatar" />
          <div>
            <a class="post-detail-username" href="/@{{ username }}">{{ username }}</a>
            <span class="post-detail-date">{{ date }}</span>
          </div>
        </div>
        <div class="post-detail-content">
          <h2 class="post-detail-title">{{ title }}</h2>
          <div>{{ content }}</div>
        </div>
      </div>
    </main>
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

    <main>
      <div class="container">
        <h1>Posts by {{ username }}</h1>
        <div class="post-card-grid">{{ posts }}</div>
      </div>
    </main>
  </body>
</html>
`,
};

export type PartialName = keyof typeof partials;
