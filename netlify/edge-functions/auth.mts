import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";
import type { Config, Context } from "@netlify/edge-functions";

// let buffer = "";

export default async function handler(req: Request, context: Context) {
  const userSignedIn = false;

  if (!userSignedIn) {
    return Response.redirect("/login", 303);
  }

  // const response = await context.next();
  // console.log(response);
  // console.log("hello world");

  // return new HTMLRewriter()
  //   .on("*", {
  //     text(text) {
  //       buffer += text.text;

  //       if (text.lastInTextNode) {
  //         text.replace(buffer.replace(/hello\-world/gi, "HELLO WORLD"));
  //         buffer = "";
  //       } else {
  //         text.remove();
  //       }
  //     },
  //   })
  //   .transform(response);
}

export const config: Config = {
  path: "/*",
  excludedPath: "/login",
};
