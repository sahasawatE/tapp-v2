import { defineStore } from "pinia";
import type { User } from "~/types/use.type";

export const useStore = defineStore("main-store", {
  state: (): { loading: boolean; user: User | null } => {
    return {
      loading: false,
      user: null,
    };
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setUser(user: User | null) {
      this.user = user;
    },
  },

  getters: {
    getLoading: (state): boolean => {
      return state.loading;
    },
    getUser: (state): User | null => {
      return state.user;
    },
  },
});
