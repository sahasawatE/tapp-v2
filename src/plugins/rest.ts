import type { NuxtApp } from "#app";
import type { AxiosInstance } from "axios";
import type { User, UserResponse } from "~/types/use.type";

class Rest {
  private app: NuxtApp;
  private api: AxiosInstance;

  private headers = {
    "auth-token": "",
  };

  constructor() {
    const app = useNuxtApp();
    const cookie = useCookie("auth-token");
    const api = app.$axios;

    this.app = app;
    this.api = api;
    this.headers["auth-token"] = cookie.value || "";
  }

  async post(endpoint: string, param?: { [key: string]: any }) {
    try {
      const cookie = useCookie("auth-token");
      const token = cookie.value || "";
      this.headers["auth-token"] = token;
      const { data, status } = await this.api.post(endpoint, param, {
        headers: this.headers,
      });
      if (status === 200) {
        const response = data as { status: number; data: any };
        if (status === 200) {
          return response.data;
        } else {
          throw new Error(`ERROR status : ${status}`);
        }
      } else if (status === 401) {
        this.logout();
      } else {
        throw new Error(`ERROR status : ${status}`);
      }
    } catch (err) {
      throw new Error(err as string);
    }
  }

  private async getOptions(path: string, name: string, optional?: any) {
    try {
      const param = {
        name,
        optional,
      };
      const options = await this.post(path, param);

      return options;
    } catch (err) {
      this.app.$dialog.toast.error(err as string);
      throw new Error(err as string);
    }
  }

  async options(name: string, optional?: any) {
    try {
      const options = await this.getOptions("/options", name, optional);

      return options;
    } catch (err) {
      this.app.$dialog.toast.error(err as string);
      throw new Error(err as string);
    }
  }

  async optionsDefault(name: string, optional?: any) {
    try {
      const options = await this.getOptions(
        "/options/getDefault",
        name,
        optional,
      );

      return options;
    } catch (err) {
      this.app.$dialog.toast.error(err as string);
      throw new Error(err as string);
    }
  }

  async login(user_id: string, user_password: string) {
    try {
      const user: UserResponse = await this.post("/login", {
        user_id,
        user_password,
      });

      const cookie = useCookie("auth-token");
      cookie.value = user.token;

      return user.user;
    } catch (err) {
      this.app.$dialog.toast.error(err as string);
      throw new Error(err as string);
    }
  }

  logout() {
    const cookie = useCookie("auth-token");

    cookie.value = "";
    this.app.$store.setUser(null);

    return true;
  }

  async checkToken() {
    try {
      const res = await this.post("/");

      if (res) {
        const user: User = {
          No: res.No,
          No_user: res.No_user,
          User_detail: res.User_detail,
          User_branch: res.User_branch,
          User_firstname: res.User_firstname,
          User_id: res.User_id,
          User_lastname: res.User_lastname,
          User_level: res.User_level,
        };

        this.app.$store.setUser(user);

        return true;
      }
      return false;
    } catch (err) {
      this.app.$dialog.toast.error(err as string);
    }
    return false;
  }
}

export default defineNuxtPlugin(() => {
  const rest = new Rest();
  return {
    provide: {
      rest,
    },
  };
});
