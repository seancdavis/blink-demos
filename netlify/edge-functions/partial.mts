import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts';
import { html } from 'https://deno.land/x/html/mod.ts';
import type { Config, Context } from '@netlify/edge-functions';

// let buffer = "";

const header = html`<header>
  <h1>My Site</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>`;

type PartialName = 'header';

const partials: Record<PartialName, string> = {
  header,
};

class PartialHandler {
  async element(element: Element) {
    const partialName = element.getAttribute('name');
    if (partialName && partialName in partials) {
      element.replace(partials[partialName as PartialName], { html: true });
    }
  }
}

export default async function handler(req: Request, context: Context) {
  // const userSignedIn = false;

  // if (!userSignedIn) {
  //   return Response.redirect("/login", 303);
  // }

  const response = await context.next();
  // console.log(response);
  // console.log("hello world");

  return new HTMLRewriter().on('partial', new PartialHandler()).transform(response);
}

export const config: Config = {
  path: '/*',
};
