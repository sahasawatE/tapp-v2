import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

import { md3 } from "vuetify/blueprints";

import colors from "../../node_modules/vuetify/lib/util/colors.mjs";

const light = {
  dark: false,
  variables: {},
  colors: {
    primary: colors.orange.base,
    secondary: colors.blue.darken1,
    accent: colors.grey.darken1,
    error: colors.red.accent3,
    background: colors.indigo.lighten5,
    info: colors.teal.darken1,
    thead: colors.orange.lighten4,
    blue: colors.blue.base,
    green: colors.green.base,
    yellow: colors.yellow.darken1,
  },
};

const dark = {
  dark: true,
  variables: {},
  colors: {
    primary: colors.orange.darken4,
    secondary: colors.blue.darken2,
    background: colors.grey.darken4,
    surface: colors.grey.darken3,
    "surface-light": colors.grey.darken3,
    info: colors.teal.lighten1,
    thead: colors.orange.darken4,
    blue: colors.blue.darken1,
    green: colors.green.darken1,
    yellow: colors.yellow.darken2,
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md3,
    theme: {
      defaultTheme: "light",
      themes: {
        light,
        dark,
      },
    },
    defaults: {
      VBtn: {
        rounded: "lg",
        variant: "flat",
        dark: true,
        // class: ["text-white"],
      },
      VTextField: {
        variant: "outlined",
        hideDetails: true,
        hideSpinButtons: true,
        color: "primary",
        density: "comfortable",
      },
      VCard: {
        variant: "flat",
      },
      VExpansionPanels: {
        color: "white",
      },
      VDatePicker: {
        color: "blue",
      },
      VList: {
        bgColor: "white",
      },
      VListItem: {
        class: ["py-4 px-6"],
      },
      VDivider: {
        thickness: "1",
        color: "grey-darken-4",
        style: "opacity: 1 !important",
      },
      VChip: {
        rounded: true,
      },
      VImg: {
        class: ["t-pointer-events-none"],
      },
      VSelect: {
        hideDetails: true,
        variant: "outlined",
        density: "comfortable",
      },
      VTextarea: {
        hideDetails: true,
        variant: "outlined",
        color: "primary",
      },
      VAutocomplete: {
        hideDetails: true,
        variant: "outlined",
        density: "comfortable",
      },
      VProgressLinear: {
        rounded: true,
        color: "primary",
      },
    },
  });
  app.vueApp.use(vuetify);
});
