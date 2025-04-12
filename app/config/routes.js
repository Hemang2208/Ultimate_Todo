// Central configuration for all application routes
export const routes = {
  home: "/",
  dashboard: "/dashboard",
  auth: {
    login: "/user/login",
    register: "/user/register",
    logout: "/user/logout",
    profile: "/user/profile"
  },
  features: {
    maintenance: "/page/maintenance",
    notFound: "/page/notfound",
    unauthorized: "/page/unauthorized"
  },
  api: {
    auth: "/api/auth",
    serverTime: "/api/server-time"
  }
};

// Helper function to get route paths
export const getRoute = (path) => {
  return path.split(".").reduce((obj, key) => obj[key], routes);
};