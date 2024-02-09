<template>
  <div class="d-flex flex-column t-gap-4">
    <v-row justify="space-between">
      <v-col cols="auto">
        <v-btn
          color="info"
          prepend-icon="mdi-plus"
          text="เพิ่มข้อมูล"
          @click="add_modal = true"
        ></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          prepend-icon="mdi-magnify"
          text="ค้นหา"
          @click="search_modal = true"
        ></v-btn>
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
      <template #data.edit_del>
        <div class="d-flex flex-row t-gap-2">
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-pencil"
            color="secondary"
          ></v-btn>
          <v-btn
            size="small"
            variant="tonal"
            icon="mdi-delete"
            color="error"
          ></v-btn>
        </div>
      </template>
    </common-data-table>

    <accounting-search-modal
      :open="search_modal"
      @close="search_modal = false"
    />
    <accounting-add-modal :open="add_modal" @close="add_modal = false" />
  </div>
</template>

<script lang="ts">
import moment from "moment";
import type { HeaderProp } from "~/types/table.type";
import type { AccResponse } from "~/types/accounting.type";

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
    const add_modal = ref(false);

    return {
      table,
      search_modal,
      add_modal,
    };
  },
  async mounted() {
    this.$store.setLoading(true);

    const quarter = moment().quarter();
    const { start, end } = this.getQuarterRange(quarter);

    await this.fetchDataTable("acc1", moment().format("YYYY-MM"), {
      quarter_start: start,
      quarter_end: end,
    });

    this.$store.setLoading(false);
  },
  computed: {
    today() {
      return moment().toDate();
    },
  },
  methods: {
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
      const body =
        this.$store.user?.User_level === "SuperAdmin"
          ? {
              ...param,
              db,
              date,
              user_id: this.$store.getUser?.User_id || "",
            }
          : {
              ...param,
              db,
              date,
            };

      const res: AccResponse[] = await this.$rest.post("report/search", body);

      // if(param){
      //   // filter by parameters
      // }

      this.table.data = res;
    },
  },
});
</script>

<style></style>