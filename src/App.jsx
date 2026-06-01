import { routes } from "./routes/index.js";

export function App() {
  const route = resolveRoute(window.location.pathname);
  const Page = route.Page;

  return <Page />;
}

function resolveRoute(pathname) {
  return routes.find((route) => route.path === pathname) || routes[0];
}
