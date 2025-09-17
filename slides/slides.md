---
theme: default
author: Sean C Davis
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# TODO: Change me
title: Welcome to Slidev
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply unocss classes to the current slide
class: text-center bg-gray-100 text-gray-900
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
colorScheme: light
fonts:
  sans: Source Serif Pro
  serif: Source Serif Pro
  mono: Operator Mono
seoMeta:
  # By default, Slidev will use ./og-image.png if it exists,
  # or generate one from the first slide if not found.
  ogImage: auto
  # ogImage: https://cover.sli.dev
---

<h1>Seeing Beyond<br>the Framework Illusion</h1>

<div class="title-author">
  Sean C Davis
</div>

---
layout: Setup
---

<h2>
  <span :class="{ 'strike-through': $clicks >= 1 }">Why Vue is better than React!</span>
</h2>

<h2>
  <span :class="{ 'strike-through': $clicks >= 1 }">You should migrate from Next to TanStack immediately!</span>
</h2>

<h2>
  <span :class="{ 'strike-through': $clicks >= 1 && $clicks < 2 }">11ty is a full-stack framework!</span>
</h2>

<h2>
  <span :class="{ 'strike-through': $clicks >= 1 }">Astro is the best choice for enterprises!</span>
</h2>

<div v-click="1" style="display: none;"></div>
<div v-click="2" style="display: none;"></div>

<!--
- This is not “how to choose a framework”
- You've already done that. You have your opinions
- These are factual statements btw
- This is about your long-term relationship with your framework
- If you've fallen out of love with your framework, I will help you find that spark again
- If you love your framework, I'll help you understand why
- But then I'll tear that all down, because things are changing, and the way we think about frameworks needs to change, too.
- Okay, so maybe it is a little bit about how to choose a framework
- Also, kind of a little about 11ty
 -->

---
layout: SCDIntro
---

# Sean C Davis

::title::

Developer Education, Netlify

::image::

![Sean C Davis avatar](./images/seancdavis-avatar.png)

::links::

<div class="intro-link">
  <img src="./images/icons/github.svg" alt="GitHub" />
  <span>@seancdavis</span>
</div>

<div class="intro-link">
  <img src="./images/icons/bluesky.svg" alt="Bluesky" />
  <img src="./images/icons/website.svg" alt="Website" />
  <span>@seancdavis.com</span>
</div>

<div class="intro-link">
  <img src="./images/icons/linkedin.svg" alt="LinkedIn" />
  <img src="./images/icons/x.svg" alt="Twitter" />
  <span>@seancdavis29</span>
</div>

---
layout: statement
---

# How do we choose our framework?

---
layout: ContainedGif
backgroundSize: contain
---

<img src="./images/schitts-feelings.gif" />

<!--
- We choose based on FEELINGS!
- This can be influenced by brand and community
- But also plays into developer experience
 -->

---
layout: statement
---

# Developer Experience (DX)

---
layout: statement
---

# Good DX means shipping features faster and maintaining easier over time.

<!--
1. How fast can you ship an MVP?
2. DX affects the cost of maintaining the application over time.
- After that, how fast you can deliver features is a product of your engineering practices.
 -->

---
layout: statement
---

# A framework's value comes from the engineering practices applied to its DX.

---
layout: ContainedGif
backgroundSize: contain
---

<img src="./images/parks-rec-drumroll.gif" />

---
layout: statement
---

# User Experience (UX)

---
layout: statement
---

# Users don't care about your framework choice.

# They want to get things done.

# Fast.

<!--
And if you optimize that ...
 -->

---
layout: statement
---

# Most frameworks are really good.

# All frameworks have tradoffs.

<!--
- If you’re building a single‑page application or a single‑page application framework, your optimization patterns will look a lot different.

- We adapt our behavior and our justification after the choice.
- I’m not discrediting the thinking.
- The reality is it works because you pick a [Next/Nuxt/whatever]; they’re all really well designed.
 -->

---
layout: statement
---

# What does your framework do for your users in production?

<!--
- Where the framework disappears... ?
- This one is more about how when you serve HTML that's what the user gets.
- This is the question I asked myself, because ...

- Pick on Astro because I have only one problem with Astro and this is not it.
 -->

---
layout: two-cols-header
---

# Astro

::left::

<v-click>

## Development

```astro
---
import Welcome from "../components/Welcome.astro";
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <Welcome />
</Layout>
```

</v-click>

::right::

<v-click>

## Production

```html
<!DOCTYPE html>
<html lang="en" data-astro-cid-sckkx6r4>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content="Astro v5.13.7" />
    <title>Astro Basics</title>
    <style>
      /* ... */
    </style>
  </head>
  <body data-astro-cid-sckkx6r4>
    <div id="container" data-astro-cid-mmc7otgs>
      <!-- ... -->
    </div>
  </body>
</html>
```

</v-click>

---
layout: ContainedGif
backgroundSize: contain
---

<img src="./images/arrested-dev-magic.gif" />

<!-- # The framework disappears! -->

---

# TODO

Simple diagram of an SSG build process

---
layout: two-cols-header
---

# Ruby on Rails App


::left::

<v-click>

## Development

```ruby
class UsersController < ApplicationController
  authenticate! :user, except: %i[accept_invitation complete_invitation]
  set! :user, only: %i[show edit update destroy]

  def index
    @users = User.all.includes(:company)
    @companies = Company.by_name
    params[:sort] ||= { by: :last_name, type: :alpha, in: :asc }
    @users = sort_collection(@users)
    @users = Kaminari.paginate_array(@users).page(params[:page] || 1)
  end
end
```

</v-click>

::right::

<v-click>

## Production

```ruby
class UsersController < ApplicationController
  authenticate! :user, except: %i[accept_invitation complete_invitation]
  set! :user, only: %i[show edit update destroy]

  def index
    @users = User.all.includes(:company)
    @companies = Company.by_name
    params[:sort] ||= { by: :last_name, type: :alpha, in: :asc }
    @users = sort_collection(@users)
    @users = Kaminari.paginate_array(@users).page(params[:page] || 1)
  end
end
```

</v-click>

<!-- It gets more complex when you add in SSR -->

---

# Server-side rendering (SSR) with Astro

<v-click>

```ts
import netlify from "@astrojs/netlify";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: netlify(),
});
```

</v-click>

---

# TODO

# SSR in JavaScript frameworks

Diagram of SSR build process

<!--
- I’m going to deploy to Netlify because I’ve got my adapter and my Netlify plugin.
- That’s all you need as a developer; you need this Netlify plugin.
- “All the Netlify server‑side rendered stuff,” right? Yeah, no, not really.
- What’s hysterical: the technology we use to render server‑side rendered pages in Astro is called servers [serverless/“Servers”].
 -->

---
layout: statement
---

# A platform adapter hooks into a framework's build process to transform framework features into platform primitives

<!--
# Isn't it an Astro site?
Yes. No. Sort of. (IT's a spectrum)
 -->

---
layout: statement
---

# Every framework is only as powerful as the platform it runs on

---

# All these frameworks have the same set of capabilities on Netlify.

<div class="frameworks-grid">
  <img src="./images/icons/frameworks/angular.svg" alt="Angular" />
  <img src="./images/icons/frameworks/astro.svg" alt="Astro" />
  <img src="./images/icons/frameworks/docusaurus.svg" alt="Docusaurus" />
  <img src="./images/icons/frameworks/eleventy.svg" alt="Eleventy" />
  <img src="./images/icons/frameworks/gatsby.svg" alt="Gatsby" />
  <img src="./images/icons/frameworks/hugo.svg" alt="Hugo" />
  <img src="./images/icons/frameworks/nextjs.svg" alt="Next.js" />
  <img src="./images/icons/frameworks/nuxt.svg" alt="Nuxt" />
  <img src="./images/icons/frameworks/react.svg" alt="React" />
  <img src="./images/icons/frameworks/remix.svg" alt="Remix" />
  <img src="./images/icons/frameworks/svelte.svg" alt="Svelte" />
  <img src="./images/icons/frameworks/vue.svg" alt="Vue" />
</div>

<!--
How they are implemented in development varies.

TODO: Framework logos
-->

---
layout: statement
---

# Demo time!

<!--
1. Show the UIs
2. package.json
3. Example of authentication
 -->

---
layout: statement
---

# Platform integration is what matters for a framework.

<!--
Do you need a framework? Probably. But you need one that plays well with the platform.
 -->

---

# Agent experience

<img src="./images/ax-blog-post.png" />

<!--
What is really going to matter in the future.

The DX <> AX parallel
 -->

---

# Agent experience matters because DX and UX are directly impacted by the quality of solutions an agent can implement.

<!-- (And Why I love Astro) -->

---

<!-- This is where to check for the bolt output if I did that -->

# Pick what works for you. We're all different.

---

# Don't forget to have a little fun along the way!
