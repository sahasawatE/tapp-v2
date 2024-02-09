<template>
  <div>
    <div class="context">
      <div class="d-flex flex-row justify-center t-text-8xl t-font-bold pb-10">
        <div class="text-primary">T</div>
        <div class="text-secondary">A</div>
        <div class="text-primary">P</div>
        <div class="text-primary">P</div>
      </div>

      <v-btn to="signin" color="secondary">login</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "default",
      middleware: "guest",
    });
  },
});
</script>

<style scoped>
.context {
  width: 100%;
  position: absolute;
  top: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
