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
  "auth-links-signed-out": `<a class="button" href="/login">Sign in</a>
`,
  feedback: `<div class="feedback container-xs {{ classname }}">
  <small>{{ message }}</small>
</div>
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

  <!-- Favicon -->
  <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/images/favicon.svg" sizes="any" />
  <link rel="apple-touch-icon" href="/images/favicon.svg" />
</head>
`,
  header: `<header>
  <div class="header-content container">
    <a class="header-logo" href="/">
      <img src="/images/blink-logo.svg" alt="BLINK Logo" />
    </a>
    <nav>
      <auth-gate>
        <is-authenticated>
          <details class="header-auth-links signed-in">
            <summary>
              <img class="avatar" src="" alt="avatar" />
            </summary>
            <div class="header-auth-links-dropdown">
              <a href="/@" class="profile-link">Profile</a>
              <a href="/settings">Edit profile</a>
              <form action="/api/auth/logout" method="post">
                <button class="sign-out" type="submit">Sign out</button>
              </form>
            </div>
          </details>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const authDiv = document.querySelector('[data-username]')
              const dropdown = document.querySelector('.header-auth-links')

              // Update avatar and profile link with user data
              if (authDiv) {
                const username = authDiv.getAttribute('data-username')
                const avatarSrc = authDiv.getAttribute('data-avatar-src')

                const avatar = authDiv.querySelector('.avatar')
                const profileLink = authDiv.querySelector('.profile-link')

                if (avatar && avatarSrc) {
                  avatar.src = avatarSrc
                  avatar.alt = username + ' avatar'
                }
                if (profileLink && username) {
                  profileLink.href = '/@' + username
                  profileLink.textContent = username
                }
              }

              // Close dropdown on outside click or Escape key
              if (dropdown) {
                // Close on outside click
                document.addEventListener('click', (e) => {
                  if (!dropdown.contains(e.target)) {
                    dropdown.open = false
                  }
                })

                // Close on Escape key
                document.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape' && dropdown.open) {
                    dropdown.open = false
                  }
                })
              }
            })
          </script>
        </is-authenticated>
        <is-unauthenticated>
          <a class="button" href="/login">Sign in</a>
        </is-unauthenticated>
      </auth-gate>
    </nav>
  </div>
</header>
`,
  "new-post-form-guest": `<div class="container-xs new-post-form guest">
  <div class="auth-prompt">
    <h2>Share your thoughts</h2>
    <p>Sign in to create posts and join the conversation.</p>
    <div class="form-actions">
      <a class="button" href="/login">Sign in</a>
      <a class="button secondary" href="/register">Create account</a>
    </div>
  </div>
</div>
`,
  "new-post-form": `<div class="container-xs new-post-form">
  <div class="new-post-header">
    <img class="avatar new-post-avatar" src="" alt="Your avatar" />
    <h2>Write a New post</h2>
  </div>

  <form action="/api/posts/create" method="post" id="new-post-form">
    <div>
      <label for="title">Title</label>
      <input type="text" name="title" placeholder="Title" required minlength="10" maxlength="64" />
    </div>
    <div>
      <label for="content">Content</label>
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
    <div class="form-actions is-compact">
      <button class="button" type="submit" id="create-post-btn">Create post</button>
    </div>
  </form>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-post-form')
    const textarea = document.getElementById('new-post-content')
    const charCount = document.getElementById('new-post-remaining-count')
    const submitBtn = document.getElementById('create-post-btn')
    const maxLength = parseInt(textarea.getAttribute('maxlength'), 10)
    let isSubmitting = false

    // Character counter
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

    // Prevent multiple submissions
    form.addEventListener('submit', (e) => {
      if (isSubmitting) {
        e.preventDefault()
        return false
      }

      isSubmitting = true
      submitBtn.disabled = true
      submitBtn.textContent = 'Creating...'

      // Re-enable after 5 seconds as fallback (in case of network issues)
      setTimeout(() => {
        isSubmitting = false
        submitBtn.disabled = false
        submitBtn.textContent = 'Create post'
      }, 5000)
    })

    // Update avatar with user data from auth-gate
    const authDiv = document.querySelector('[data-username]')
    const avatar = document.querySelector('.new-post-avatar')

    if (authDiv && avatar) {
      const username = authDiv.getAttribute('data-username')
      const avatarSrc = authDiv.getAttribute('data-avatar-src')

      if (avatarSrc) {
        avatar.src = avatarSrc
        avatar.alt = username + "'s avatar"
      }
    }
  })
</script>
`,
  "not-found-content": `<div class="container-xs not-found-page">
  <div class="not-found-content">
    <h1>404</h1>
    <h2>Page not found</h2>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <div class="not-found-actions">
      <a href="/" class="button">Go home</a>
    </div>
  </div>
</div>
`,
  "not-found": `<!doctype html>
<html lang="en">
  <partial name="head" title="Page Not Found"></partial>
  <body>
    <partial name="header"></partial>
    <feedback></feedback>

    <main>
      <partial name="not-found-content"></partial>
    </main>
  </body>
</html>
`,
  pagination: `<nav class="pagination container-xs">
  <div class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</div>

  <div class="pagination-controls">
    <a
      href="/?page={{ prevPage }}"
      class="button pagination-prev"
      rel="prev"
      data-show="{{ hasPrevPage }}"
    >
      ← Previous
    </a>

    <a
      href="/?page={{ nextPage }}"
      class="button pagination-next"
      rel="next"
      data-show="{{ hasNextPage }}"
    >
      Next →
    </a>
  </div>
</nav>

<script>
  // Hide pagination buttons when not needed
  document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.querySelector('.pagination-prev')
    const nextBtn = document.querySelector('.pagination-next')

    if (prevBtn && prevBtn.getAttribute('data-show') === 'false') {
      prevBtn.style.display = 'none'
    }

    if (nextBtn && nextBtn.getAttribute('data-show') === 'false') {
      nextBtn.style.display = 'none'
    }
  })
</script>
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
  "profile-no-posts": `<div class="profile-no-posts">
  <p>{{ username }} hasn't posted anything yet.</p>
</div>
`,
  profile: `<!doctype html>
<html lang="en">
  <partial name="head" title="{{ username }} Profile"></partial>
  <body>
    <partial name="header"></partial>
    <feedback></feedback>

    <main>
      <div class="container">
        <div class="profile-header">
          <img class="avatar profile-avatar" src="{{ avatarSrc }}" alt="{{ username }}'s avatar" />
          <div class="profile-info">
            <h2>@{{ username }}</h2>
            <p class="profile-stats">{{ postStats }}</p>
          </div>
        </div>

        <div class="profile-content">
          <h1>Latest posts from {{ username }}</h1>
          <div class="post-card-grid">{{ posts }}</div>
        </div>
      </div>
    </main>
  </body>
</html>
`,
};

export type PartialName = keyof typeof partials;
