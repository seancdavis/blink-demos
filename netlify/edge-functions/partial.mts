import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts';
import { html } from 'https://deno.land/x/html/mod.ts';
import type { Config, Context } from '@netlify/edge-functions';
import { partials, type PartialName } from '../../src/utils/partial-data.ts';

// let buffer = "";

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
