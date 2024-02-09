<template>
  <v-form ref="other-form" lazy-validation>
    <div class="d-flex flex-column t-gap-4">
      <common-datepicker
        v-model="form.data.transac_date"
        title="วันที่บันทึก"
        label="วันที่บันทึก"
      />
      <v-textarea v-model="form.data.detail" label="รายละเอียด"></v-textarea>
      <v-tabs v-model="tab" grow>
        <v-tab :value="0">Dr.</v-tab>
        <v-tab :value="1">Cr.</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="0">
          <div class="pa-2 d-flex flex-column align-center t-gap-2">
            <accounting-add-other-card :bank-options="options.dr" />
            <v-btn
              color="green"
              variant="tonal"
              prepend-icon="mdi-plus"
              text="เพิ่มรายการ"
              block
            ></v-btn>
          </div>
        </v-window-item>
        <v-window-item :value="1">
          <div>cr</div>
        </v-window-item>
      </v-window>
    </div>
  </v-form>
</template>

<script lang="ts">
import moment from "moment";
import type { VForm } from "vuetify/components";
import type { BankOption } from "~/types/accounting.type";

export default defineNuxtComponent({
  setup() {
    const tab = ref(0);

    const form = useFormState({
      transac_date: moment().format("DD/MM/YYYY"),
      detail: "",
    });

    const options = ref({
      dr: [] as BankOption[],
      cr: [] as BankOption[],
    });

    return {
      tab,
      form,
      options,
    };
  },
  async mounted() {
    this.$store.setLoading(true);

    await this.getBankCr();
    await this.getBankDr();

    this.$store.setLoading(false);
  },
  computed: {
    formRef() {
      const ref = this.$refs["other-form"] as VForm;

      return ref;
    },
  },
  methods: {
    async getBankCr() {
      const bank_cr: BankOption[] = await this.$rest.options("bank-options", {
        mode: 3,
        type: "Cr",
      });

      this.options.cr = bank_cr;
    },
    async getBankDr() {
      const bank_dr: BankOption[] = await this.$rest.options("bank-options", {
        mode: 3,
        type: "Dr",
      });

      this.options.dr = bank_dr;
    },
  },
});
</script>

<style></style>
