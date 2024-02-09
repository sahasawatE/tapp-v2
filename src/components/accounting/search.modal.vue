<template>
  <div>
    <common-modal
      :active="$props.open"
      title="ค้นหาข้อมูล"
      ok-text="ค้นหา"
      @close="$emit('close')"
    >
      <div>123</div>
    </common-modal>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    search: null,
    close: null,
  },
});
</script>

<style></style>
