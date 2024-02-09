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
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list :lines="false" density="compact" nav>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
          :prepend-icon="item.icon"
          :title="item.text"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar title="TAPP">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      </template>
      <template #append>
        <div class="d-flex flex-row t-gap-2 align-center">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="tonal"
                rounded
                prepend-icon="mdi-account"
              >
                {{ userName }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                title="ออกจากระบบ"
                prepend-icon="mdi-logout"
                @click="handleLogout"
              >
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            :icon="
              isDark ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny'
            "
            :color="isDark ? 'yellow' : 'primary'"
            @click="toggleTheme"
          ></v-btn>
        </div>
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
  name: "MainLayout",
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
      items: [
        { text: "Home", icon: "mdi-view-dashboard", link: "/home" },
        { text: "Accounting", icon: "mdi-book-open", link: "/accounting" },
      ],
      drawer: false,
    };
  },
  computed: {
    userName() {
      return this.$store.getUser?.User_firstname || "";
    },
    isDark() {
      return this.$vuetify.theme.current.dark;
    },
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
    handleLogout() {
      const out = this.$rest.logout();
      if (out) {
        this.$router.push("/signin");
      }
    },
  },
};
</script>

<style></style>
