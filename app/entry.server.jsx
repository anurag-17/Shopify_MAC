import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";

export const streamTimeout = 5000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  try {
    addDocumentResponseHeaders(request, responseHeaders);
    const userAgent = request.headers.get("user-agent");
    const isBotRequest = isbot(userAgent ?? "");
    const callbackName = isBotRequest ? "onAllReady" : "onShellReady";

    return new Promise((resolve, reject) => {
      const { pipe, abort } = renderToPipeableStream(
        <RemixServer context={remixContext} url={request.url} />,
        {
          [callbackName]: () => {
            try {
              const body = new PassThrough();
              const stream = createReadableStreamFromReadable(body);

              responseHeaders.set(
                "Content-Security-Policy",
                "frame-ancestors 'self' https://admin.shopify.com https://*.myshopify.com;"
              );
              responseHeaders.set("Permissions-Policy", "interest-cohort=()");
              responseHeaders.set("X-Frame-Options", "ALLOWALL");

              resolve(
                new Response(stream, {
                  headers: responseHeaders,
                  status: responseStatusCode,
                })
              );
              pipe(body);
            } catch (error) {
              reject(error);
            }
          },
          onShellError(error) {
            console.error("Shell rendering error:", error);
            reject(error);
          },
          onError(error) {
            console.error("Streaming error:", error);
          },
        }
      );

      setTimeout(() => {
        console.error("Stream timeout reached, aborting...");
        abort();
      }, streamTimeout + 1000);
    });
  } catch (error) {
    console.error("Unexpected error in handleRequest:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
