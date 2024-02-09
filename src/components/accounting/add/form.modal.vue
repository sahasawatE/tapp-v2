<template>
  <div>
    <common-modal :active="$props.open" :title="title" @close="$emit('close')">
      <div>
        <accounting-add-receive v-if="$props.selectedMenu === 0" />
      </div>
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
    selectedMenu: {
      type: Number,
      required: true,
    },
  },
  emits: {
    close: null,
    submit: null,
  },
  data() {
    return {};
  },
  computed: {
    title() {
      switch (this.$props.selectedMenu) {
        case -1:
          return "";

        case 0:
          return "รายรับ";

        case 1:
          return "รายจ่าย";

        case 2:
          return "อื่น ๆ";

        default:
          return "";
      }
    },
  },
});
</script>

<style></style>
