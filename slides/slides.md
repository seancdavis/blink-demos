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

# Seeing Beyond the Framework Illusion

Sean C Davis

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

Developer Advocate, Netlify

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
layout: image
image: ./images/schitts-feelings.gif
backgroundSize: contain
---


<!--
- We choose based on FEELINGS!
- This can be influenced by brand and community
- But also plays into developer experience
 -->

---

# Developer Experience (DX)

TtMVP (Time to Minimum Viable Product)

Balance of shipping new features quickly and maintaining the application over time.

<!--
1. How fast can you ship an MVP?
2. DX affects the cost of maintaining the application over time.
- After that, how fast you can deliver features is a product of your engineering practices.
 -->

---

The value of the framework is the combination of the developer experience it provides and the engineering practices you apply to make best use of it.

---

# User Experience (UX)

Users don't care about your framework choice; they care about TTD (time to done) and reliability.

<!--
And if you optimize that ...
 -->

---

# Most frameworks are really good

---

# Tradeoffs are unavoidable

<!--
- If you’re building a single‑page application or a single‑page application framework, your optimization patterns will look a lot different.

- We adapt our behavior and our justification after the choice.
- I’m not discrediting the thinking.
- The reality is it works because you pick a [Next/Nuxt/whatever]; they’re all really well designed.
 -->

---

# What does your framework do for your users?

---

# What role does your framework play in production?

<!--
- Where the framework disappears... ?
- This one is more about how when you serve HTML that's what the user gets.
- This is the question I asked myself, because ...

- Pick on Astro because I have only one problem with Astro and this is not it.
 -->

---

# Astro

## Code in development

```astro
---
import Welcome from "../components/Welcome.astro";
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <Welcome />
</Layout>
```

## Code in production

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
      <img
        id="background"
        src="/_astro/background.BPKAcmfN.svg"
        alt=""
        fetchpriority="high"
        data-astro-cid-mmc7otgs
      />
      <main data-astro-cid-mmc7otgs>
        <section id="hero" data-astro-cid-mmc7otgs>
          <a href="https://astro.build" data-astro-cid-mmc7otgs>
            <img
              src="/_astro/astro.Dm8K3lV8.svg"
              width="115"
              height="48"
              alt="Astro Homepage"
              data-astro-cid-mmc7otgs
            />
          </a>
          <h1 data-astro-cid-mmc7otgs>
            To get started, open the
            <code data-astro-cid-mmc7otgs>
              <pre data-astro-cid-mmc7otgs>src/pages</pre>
            </code>
            directory in your project.
          </h1>
          <section id="links" data-astro-cid-mmc7otgs>
            <a
              class="button"
              href="https://docs.astro.build"
              data-astro-cid-mmc7otgs
            >
              Read our docs
            </a>
            <a href="https://astro.build/chat" data-astro-cid-mmc7otgs>
              Join our Discord
              <!-- svg code ... -->
            </a>
          </section>
        </section>
      </main>
      <a
        href="https://astro.build/blog/astro-5/"
        id="news"
        class="box"
        data-astro-cid-mmc7otgs
      >
        <!-- svg code ... -->
        <h2 data-astro-cid-mmc7otgs>What's New in Astro 5.0?</h2>
        <p data-astro-cid-mmc7otgs>
          From content layers to server islands, click to learn more about the
          new features and improvements in Astro 5.0
        </p>
      </a>
    </div>
  </body>
</html>
```

---

# The framework disappears!

![](./images/arrested-dev-magic.gif)

---

Simple diagram of an SSG build process

---

<!-- It gets more complex when you add in SSR -->

# Ruby on Rails Application

## Code in development

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

## Code in production

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

---

# SSR with Astro

```ts
import netlify from "@astrojs/netlify";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: netlify(),
});
```

---

# SSR in JavaScript frameworks

Diagram of SSR build process

<!--
- I’m going to deploy to Netlify because I’ve got my adapter and my Netlify plugin.
- That’s all you need as a developer; you need this Netlify plugin.
- “All the Netlify server‑side rendered stuff,” right? Yeah, no, not really.
- What’s hysterical: the technology we use to render server‑side rendered pages in Astro is called servers [serverless/“Servers”].
 -->

---

# A platform adapter hooks into a framework's build process to translate framework features into platform primitives

<!--
# Isn't it an Astro site?
Yes. No. Sort of. (IT's a spectrum)
 -->

---

# Every framework is only as powerful as the platform it runs on

---

# All these frameworks have the same set of capabilities on Netlify.

How they are implemented in development varies.

TODO: Framework logos

---

# Demo Time: Platform primitives 101

<!--
1. Show the UIs
2. package.json
3. Example of authentication
 -->

---

# Framework Features + Platform Primitives

<!--
Do you need a framework? Probably. But you need one that plays well with the platform.
 -->

---

# Agent experience

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
