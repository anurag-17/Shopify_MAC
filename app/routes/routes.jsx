import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shopOrigin = url.searchParams.get("shop"); // Get shop origin from URL params

  return json({ shopOrigin });
};

export default function Index() {
  const { shopOrigin } = useLoaderData();

  useEffect(() => {
    if (window.top === window.self) {
      window.location.assign(
        `https://admin.shopify.com/store/demo-client-new/apps/test-shweta-app`
      );
    }
  }, [shopOrigin]);

  
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="http://147.93.108.140/"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
