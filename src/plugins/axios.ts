import axios from "axios";

function restInner() {
  const rest = axios.create();
  rest.defaults.baseURL = "https://tapp-acc-api.vercel.app/";
  rest.defaults.headers.common = {
    Accept: "*/*",
  };

  return rest;
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      axios: restInner(),
    },
  };
});
