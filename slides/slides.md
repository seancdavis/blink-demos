---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Welcome to Slidev
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# open graph
seoMeta:
  # By default, Slidev will use ./og-image.png if it exists,
  # or generate one from the first slide if not found.
  ogImage: auto
  # ogImage: https://cover.sli.dev
---

# Welcome to Slidev

Hello world >> do the bolt thing

---

# Setup

Something about the takeaway

- This is not a “how to choose a framework” talk—those are boring and overdone.
- This is less “how to choose a framework” and more “should you choose a framework?”
- Do you need a framework? Do you need a framework at all?
- What is the framework doing for you?

---

# Intro

About me ...

---

We choose our frameworks based on DX and feelings first; we rationalize later (and that’s okay).

"For the wrong reasons"

---

- DX affects the cost of maintaining the application over time.
- The value in the framework choice is partly how fast you can get to MVP.
- After that, how fast you can deliver features is a product of your engineering practices.
- How maintainable the framework is matters.

---

Users don't care about your framework choice; they care about time-to-task and reliability.

---

- If you’re building a single‑page application or a single‑page application framework, your optimization patterns will look a lot different.

- We adapt our behavior and our justification after the choice.
- I’m not discrediting the thinking.
- The reality is it works because you pick a [Next/Nuxt/whatever]; they’re all really well designed.

---

Where the framework disappears... ?

This one is more about how when you serve HTML that's what the user gets.

---

# Rails

Rails in dev vs prod

---

# JS

JS in dev vs prod

---

# So I built the same app

3 ways

---

# Demo part #1

Blink app comparison, showing the UI and package.json

---

# Where the framework “disappears”

Build + adapter translate features into platform components

---

# Isn't it an Astro site?

Yes. No. Sort of. (IT's a spectrum)

---

# SSR

- I’m going to deploy to Netlify because I’ve got my adapter and my Netlify plugin.
- That’s all you need as a developer; you need this Netlify plugin.
- “All the Netlify server‑side rendered stuff,” right? Yeah, no, not really.
- What’s hysterical: the technology we use to render server‑side rendered pages in Astro is called servers [serverless/“Servers”].

---

Every framework is only as powerful as the platform it runs on

---

All these frameworks have the same capabilities on Netlify. They just look a little different.

---

# Demo #2: Platform primitives 101

HTML/CSS/JS, routes, assets, functions/edge, caching

Show how these features come through with and without a framework

Authentication??

Same user journey; different wiring

---

# Framework Features + Platform Primitives

Do you need a framework? Probably. But you need one that plays well with the platform.

---

# Agent experience

What is really going to matter in the future.

The DX <> AX parallel

---

# Why agent experience matters

Because the agent making good decisions directly affects DX and UX.

(And Why I love Astro)

---

Pick what works for you. Have a little fun along the way.

---

# Thanks!

links ...
