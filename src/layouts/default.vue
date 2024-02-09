<template>
  <v-app>
    <client-only>
      <v-sonner />
    </client-only>
    <v-overlay
      persistent
      :model-value="$store.getLoading"
      class="align-center justify-center t-bg-slate-300/20"
    >
      <div class="d-flex flex-column align-center t-gap-8">
        <v-progress-circular
          color="primary"
          indeterminate
          :size="56"
        ></v-progress-circular>

        <v-btn
          v-show="show_cancel_loading"
          color="error"
          @click="handleCancelLoading"
        >
          ปิด
        </v-btn>
      </div>
    </v-overlay>
    <v-app-bar title="TAPP">
      <template #append>
        <v-btn
          :icon="
            $vuetify.theme.current.dark
              ? 'mdi-white-balance-sunny'
              : 'mdi-moon-waning-crescent'
          "
          @click="toggleTheme"
        ></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { useTheme } from "vuetify";

import { VSonner } from "vuetify-sonner";
import "vuetify-sonner/style.css";

export default {
  name: "DefaultLayout",
  components: {
    VSonner,
  },
  setup() {
    const theme = useTheme();

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark
        ? "light"
        : "dark";
    };

    return {
      toggleTheme,
    };
  },
  data() {
    return {
      show_cancel_loading: false,
      timeout_id: null as any,
    };
  },
  methods: {
    handleCancelLoading() {
      this.$store.setLoading(false);
    },
    timeout() {
      this.timeout_id = setTimeout(() => {
        this.show_cancel_loading = true;
      }, 3000);
    },
  },
};
</script>

<style></style>
