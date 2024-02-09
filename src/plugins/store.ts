import { useStore } from "~/stores";

export default defineNuxtPlugin(() => {
  const store = useStore();
  return {
    provide: {
      store,
    },
  };
});
