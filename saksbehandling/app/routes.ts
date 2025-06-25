import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("layouts/AuthLockoutLayout.tsx", [
        index("routes/home.tsx"), 
        route("case/:id", "routes/casePage.tsx"), // Dynamic page
    ]),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    route("/privacy", "routes/privacyPolicy.tsx")
] satisfies RouteConfig;
