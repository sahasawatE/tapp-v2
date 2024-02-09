<template>
  <div class="d-flex flex-column t-gap-4">
    <div class="d-flex flex-row pb-10 t-text-4xl t-font-bold">
      <span>WELCOME&nbsp;TO &nbsp;</span>
      <div class="text-primary">T</div>
      <div class="text-secondary">A</div>
      <div class="text-primary">P</div>
      <div class="text-primary">P</div>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col v-for="(b, i) in branches" :key="i" cols="12">
            <div class="d-flex flex-column t-gap-2">
              <v-alert color="primary" variant="tonal">{{ b }}</v-alert>
              <div class="d-flex flex-row t-gap-2">
                <v-btn
                  v-for="(u, j) in users[b]"
                  :key="`${i}-${j}`"
                  color="secondary"
                  @click="handleClickUser(u.User_id, u.User_firstname)"
                >
                  {{ u.User_firstname }}
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <common-modal
      :active="open_login_modal"
      :title="`กรอกรหัสผ่านของ ${select_user} เพื่อเข้าสู่ระบบ`"
      size="md"
      ok-text="Login"
      cancel-text="ปิด"
      @close="handleCloseLoginModal"
      @save="handleLogin"
    >
      <v-form ref="login-form" lazy-validation @submit.prevent="handleLogin">
        <v-text-field
          v-model="user_password"
          label="รหัสผ่าน"
          :type="show_password ? 'text' : 'password'"
          :append-inner-icon="
            show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          :rules="[(v: string) => !!v || 'กรุณากรอก password']"
          :hide-details="false"
          @click:append-inner="show_password = !show_password"
        ></v-text-field>
      </v-form>
    </common-modal>
  </div>
</template>

<script lang="ts">
import type { VForm } from "vuetify/components";
import type { UserListItem } from "~/types/use.type";

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "default",
      middleware: "guest",
    });

    const users = ref<{ [key: string]: UserListItem[] }>({});
    const branches = ref<string[]>([]);

    const open_login_modal = ref(false);
    const user_password = ref("");
    const user_id = ref("");
    const select_user = ref("");
    const show_password = ref(false);

    return {
      users,
      branches,
      open_login_modal,
      user_password,
      select_user,
      show_password,
      user_id,
    };
  },
  async mounted() {
    this.$store.setLoading(true);

    const users = (await this.$rest.post("getListUser")) as UserListItem[];
    this.users = utils.groupBy(
      users.filter((e) => e.User_id !== "test"),
      "User_branch",
    );

    const branches = utils
      .getKEY(this.users)
      .filter((e) => e !== "admin" && e !== "ปากช่อง");
    this.branches = branches;

    this.$store.setLoading(false);
  },
  computed: {
    refForm() {
      const ref = this.$refs["login-form"] as VForm;

      return ref;
    },
  },
  methods: {
    handleClickUser(user_id: string, user_name: string) {
      this.open_login_modal = true;
      this.select_user = user_name;
      this.user_id = user_id;
    },
    handleCloseLoginModal() {
      this.open_login_modal = false;
      this.select_user = "";
      this.user_id = "";
      this.user_password = "";

      this.refForm.resetValidation();
    },
    async handleLogin() {
      this.$store.setLoading(true);
      const { valid } = await this.refForm.validate();

      if (valid && this.user_id) {
        try {
          const user = await this.$rest.login(this.user_id, this.user_password);
          this.$store.setUser(user);

          this.$router.push("/home");
        } catch (err) {
          console.log(err as string);
        }
      }
      this.$store.setLoading(false);
    },
  },
});
</script>

<style></style>
