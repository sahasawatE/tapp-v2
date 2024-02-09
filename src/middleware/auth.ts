export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client) {
    const app = useNuxtApp();
    const checked_token = await app.$rest.checkToken();
    if (checked_token) {
      if (to.path === "/" || to.path === "/signin") {
        return false;
      } else {
        return true;
      }
    } else {
      return "/";
    }
  }
});
