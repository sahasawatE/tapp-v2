import { toast } from "vuetify-sonner";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dialog: {
        toast: {
          success: (text: string) => {
            toast(text, {
              duration: 2000,
              prependIcon: "mdi-check-circle",
              cardProps: {
                color: "success",
                class: "my-toast",
              },
            });
          },
          error: (text: string) => {
            toast(text, {
              duration: 2000,
              prependIcon: "mdi-close-circle",
              cardProps: {
                color: "error",
                class: "my-toast",
              },
            });
          },
          warning: (text: string) => {
            toast(text, {
              duration: 2000,
              prependIcon: "mdi-alert",
              cardProps: {
                color: "warning",
                class: "my-toast",
              },
            });
          },
          message: (text: string) => {
            toast(text, {
              duration: 2000,
            });
          },
        },
      },
    },
  };
});
