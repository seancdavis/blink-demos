import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts';
import type { Context } from '@netlify/edge-functions';
import { partials, type PartialName } from '../../src/utils/partial-data.ts';

export class PartialHandler {
  element(element: Element) {
    const partialName = element.getAttribute('name');
    if (!partialName || !(partialName in partials)) return;

    const partialData: Record<string, string> = {};
    Array.from(element.attributes).forEach(([key, value]) => (partialData[key] = value));
    const partialContent = partials[partialName as PartialName].replace(
      /{{\s*(\w+)\s*}}/g,
      (_, key) => partialData[key] || '',
    );

    element.replace(partialContent, { html: true });
  }
}

export default async function handler(req: Request, context: Context) {
  const response = await context.next();
  return new HTMLRewriter().on('partial', new PartialHandler()).transform(response);
}
