import { ref, customRef } from "vue";

const debounce = (fn: Function, delay = 800) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const useDebouncedRef = (initialValue: any, delay: number) => {
  const state = ref(initialValue);
  const debouncedRef = customRef((track, trigger) => ({
    get() {
      track();
      return state.value;
    },
    set: debounce((value: any) => {
      state.value = value;
      trigger();
    }, delay),
  }));
  return debouncedRef;
};

export default useDebouncedRef;
