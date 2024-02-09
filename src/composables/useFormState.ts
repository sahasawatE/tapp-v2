export default function <T extends object>(initData: T) {
  const init_state = reactive({ ...initData });

  return ref({
    data: init_state,
    reset() {
      Object.assign(init_state, initData);
    },
  });
}
