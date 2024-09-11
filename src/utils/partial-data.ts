export const partials = {
  header: `<header>
  <h1>My Site</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
`,
};

export type PartialName = keyof typeof partials;
