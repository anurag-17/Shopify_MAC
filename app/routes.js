import { flatRoutes } from "@remix-run/fs-routes";

export default flatRoutes((defineRoutes) => {
  defineRoutes((route) => {
    route("/", "routes/routes.jsx"); // Load the custom React route
  });
});