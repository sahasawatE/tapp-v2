<template>
  <div class="d-flex flex-column t-gap-4">
    <v-row align="center" justify="space-between">
      <v-col cols="12" md="auto">
        <v-btn
          color="info"
          prepend-icon="mdi-plus"
          text="เพิ่มข้อมูล"
          @click="add_modal = true"
        ></v-btn>
      </v-col>
      <v-col>
        <v-row align="center" justify="end">
          <v-col md="4">
            <v-form @submit.prevent="handleSearch">
              <v-text-field
                v-model="search_string"
                variant="solo"
                placeholder="ค้นหารายการ"
                color="secondary"
                append-inner-icon="mdi-magnify"
                @click:append-inner="handleSearch"
              ></v-text-field>
            </v-form>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="secondary"
              variant="tonal"
              icon="mdi-tune"
              @click="search_modal = true"
            ></v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <common-data-table :headers="table.headers" :data="table.data">
      <template #data.history_date="{ thisData }">
        <div>
          {{ utils.dateView(thisData) }}
        </div>
      </template>
      <template #data.name_list_reference="{ thisData }">
        <v-chip label :color="thisData[0] === '+' ? 'green' : 'red'">
          {{ thisData.slice(0, 3) }}
        </v-chip>
      </template>
      <template #data.Transac_separator="{ thisData }">
        <div>
          {{ thisData || "-" }}
        </div>
      </template>
      <template #data.Transac_amout="{ thisData }">
        <div
          :class="thisData[0] === '-' ? 'text-error' : 'text-success'"
          class="font-weight-bold"
        >
          {{ thisData }}
        </div>
      </template>
      <template #data.edit_del="{ data }">
        <div class="d-flex flex-row t-gap-2">
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-pencil"
            color="secondary"
            :disabled="disableEditDelete(data)"
            @click="handleEdit(data)"
          ></v-btn>
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-delete"
            color="error"
            :disabled="disableEditDelete(data)"
            @click="handleDelete(data)"
          ></v-btn>
        </div>
      </template>
    </common-data-table>

    <accounting-search-modal
      :open="search_modal"
      @close="search_modal = false"
      @search="handleDeepSearch"
    />
    <accounting-add-modal
      :open="add_modal"
      @close="add_modal = false"
      @submit="handleRefresh"
    />
  </div>
</template>

<script lang="ts">
import moment from "moment";
import type { HeaderProp } from "~/types/table.type";
import type { AccResponse, DeepSearchForm } from "~/types/accounting.type";

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      layout: "main",
      middleware: "auth",
    });

    const headers: HeaderProp = [
      { key: "Branch_id", title: "สาขา", align: "center" },
      { key: "name_list_reference", title: "ประเภท", align: "center" },
      { key: "Transac_detail", title: "รายละเอียด" },
      { key: "Transac_separator", title: "ตัวแยก", align: "center" },
      { key: "Transac_amout", title: "เงินสด", align: "center" },
      { key: "account_amout", title: "Dr./Cr.", align: "center" },
      { key: "Bank_id", title: "เลขบัญชี", align: "center" },
      { key: "User_firstname", title: "ผู้บันทึก", align: "center" },
      { key: "history_date", title: "วันที่", align: "center" },
      { key: "edit_del", title: "", width: "20px" },
    ];

    const table = ref({
      headers,
      data: [] as AccResponse[],
    });

    const search_modal = ref(false);
    const search_string = ref("");
    const add_modal = ref(false);

    return {
      table,
      search_modal,
      add_modal,
      search_string,
    };
  },
  async mounted() {
    await this.handleRefresh();
  },
  computed: {
    today() {
      return moment().toDate();
    },
  },
  methods: {
    disableEditDelete(e: AccResponse) {
      if (this.$store.getUser) {
        if (this.$store.getUser.User_level === "user") {
          return !(
            moment().isSame(moment(e.Transac_date, "YYYY-MM-DD"), "date") &&
            e.User_id === this.$store.getUser.User_id
          );
        }
        return false;
      }
      return true;
    },
    async handleRefresh() {
      this.$store.setLoading(true);

      this.add_modal = false;

      const quarter = moment().quarter();
      const { start, end } = this.getQuarterRange(quarter);

      await this.fetchDataTable("acc1", moment().format("YYYY-MM"), {
        quarter_start: start,
        quarter_end: end,
      });

      this.$store.setLoading(false);
    },
    getQuarterRange(quarter: number) {
      const start = moment()
        .quarter(quarter)
        .startOf("quarter")
        .format("YYYY-MM-DD");

      const end = moment()
        .quarter(quarter)
        .endOf("quarter")
        .format("YYYY-MM-DD");

      return { start, end };
    },
    async fetchDataTable(
      db: string,
      date: string,
      param?: { [key: string]: any },
    ) {
      let body: any = param
        ? {
            ...param,
            db,
            date,
          }
        : {
            db,
            date,
          };

      body =
        this.$store.user?.User_level === "SuperAdmin" || param?.show_everyone
          ? body
          : {
              ...body,
              user_id: this.$store.getUser?.User_id || "",
            };

      const res: AccResponse[] = await this.$rest.post("report/search", body);
      let response = res;

      if (param) {
        if (param.bank_select) {
          if (param.bank_select === "0") {
            // ถึง
            response = response.filter(
              (e) =>
                (e.id_no >= param.bank_from && e.id_no <= param.bank_to) ||
                (e.id_no >= param.bank_to && e.id_no <= param.bank_from),
            );
          } else {
            // และ
            response = response.filter(
              (e) => e.id_no === param.bank_from || e.id_no === param.bank_to,
            );
          }
        }
        if (param.ref) {
          response = response.filter(
            (e) => e.type_list_reference === param.ref,
          );
        }
        if (!param.bank_select && param.bank_from) {
          response = response.filter((e) => e.id_no === param.bank_from);
        }
        if (param.seperator) {
          response = response.filter(
            (e) => e.Transac_separator === param.seperator,
          );
        }
        if (param.user) {
          response = response.filter((e) => e.User_id === param.user);
        }
      }

      this.table.data = response;
    },
    async handleDeepSearch(form: DeepSearchForm) {
      this.search_modal = false;
      const {
        quarter,
        start_date,
        end_date,
        ref,
        user,
        separate,
        bank_condition,
        bank_from,
        bank_to,
        show_everyone,
        show_today,
      } = form;
      const { start, end } = this.getQuarterRange(Number(quarter));
      const param: any = { show_today, show_everyone };
      if (start_date) {
        param.start_date = moment(start_date, "DD/MM/YYYY").format(
          "YYYY-MM-DD",
        );
      }
      if (end_date) {
        param.end_date = moment(end_date, "DD/MM/YYYY").format("YYYY-MM-DD");
      }
      if (ref.id_reference) param.ref = ref.id_reference;
      if (quarter) {
        param.quarter_start = moment(start, "DD/MM/YYYY").format("YYYY-MM-DD");
        param.quarter_end = moment(end, "DD/MM/YYYY").format("YYYY-MM-DD");
      }
      if (user.User_id) param.user = user.User_id;
      if (separate.id_seperate) param.seperator = separate.id_seperate;
      if (bank_condition) param.bank_select = bank_condition;
      if (bank_from.id_no) param.bank_from = bank_from.id_no;
      if (bank_to.id_no) param.bank_to = bank_to.id_no;

      this.$store.setLoading(true);
      await this.fetchDataTable("acc1", moment().format("YYYY-MM"), param);
      this.$store.setLoading(false);
    },
    handleSearch() {
      const temp1 = this.table.data;
      let temp2: AccResponse[] = [];
      if (this.search_string) {
        temp2 = temp1.filter((e) => {
          const regex = new RegExp(`(${this.search_string})`, "gi");

          return (
            e.name_list_reference.match(regex) ||
            e.Transac_detail.match(regex) ||
            e.Transac_separator.match(regex) ||
            e.Transac_amout.match(regex) ||
            e.account_amout.match(regex) ||
            e.history_date.match(regex)
          );
        });
        this.table.data = temp2;
      } else {
        this.handleRefresh();
      }
    },
    handleDelete(e: AccResponse) {
      console.log(e);
    },
    handleEdit(e: AccResponse) {
      console.log(e);
    },
  },
});
</script>

<style></style>
