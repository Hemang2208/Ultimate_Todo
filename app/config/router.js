// Define application routes
export const routes = {
  home: "/",
  dashboard: "/dashboard",
  login: "/user/login",
  register: "/user/register",
  profile: "/user/profile",
  logout: "/user/logout",
  newTask: "/tasks/new",
  editTask: (id) => `/tasks/${id}/edit`,
  viewTask: (id) => `/tasks/${id}`,
}

// Navigation helper
export const navigate = (router, path) => {
  router.push(path)
}
