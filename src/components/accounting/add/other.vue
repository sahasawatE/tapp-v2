<template>
  <v-form ref="other-form" lazy-validation>
    <div class="d-flex flex-column t-gap-4">
      <common-datepicker
        v-model="form.data.transac_date"
        title="วันที่บันทึก"
        label="วันที่บันทึก"
      />
      <v-textarea v-model="form.data.detail" label="รายละเอียด"></v-textarea>
      <v-progress-linear
        bg-color="secondary"
        bg-opacity="1"
        :model-value="amountBalance.balance"
        :height="25"
      >
        <strong>
          {{ amountBalance.balance === 50 ? "OK" : amountBalance.amount }}
        </strong>
      </v-progress-linear>
      <v-tabs v-model="tab" grow>
        <v-tab :value="0">Dr.</v-tab>
        <v-tab :value="1">Cr.</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="0">
          <div class="pa-2 d-flex flex-column align-center t-gap-2">
            <accounting-add-other-card
              v-for="(_dr, i) in form.data.dr"
              :key="`dr-${i}`"
              :bank-options="options.dr"
              name="Dr"
              :index="i"
              :can-delete="form.data.dr.length > 1"
              :form="form.data.dr[i]"
              @click-delete="handleClickDelete('dr', i)"
              @update:form="(v) => handleFormUpdate('dr', v, i)"
            />
            <v-btn
              color="green"
              variant="tonal"
              prepend-icon="mdi-plus"
              text="เพิ่มรายการ"
              block
              @click="handleAddItem('dr')"
            ></v-btn>
          </div>
        </v-window-item>
        <v-window-item :value="1">
          <div class="pa-2 d-flex flex-column align-center t-gap-2">
            <accounting-add-other-card
              v-for="(_cr, i) in form.data.cr"
              :key="`dr-${i}`"
              :bank-options="options.cr"
              name="Cr"
              :index="i"
              :can-delete="form.data.cr.length > 1"
              :form="form.data.cr[i]"
              @click-delete="handleClickDelete('cr', i)"
              @update:form="(v) => handleFormUpdate('cr', v, i)"
            />
            <v-btn
              color="green"
              variant="tonal"
              prepend-icon="mdi-plus"
              text="เพิ่มรายการ"
              block
              @click="handleAddItem('cr')"
            ></v-btn>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </v-form>
</template>

<script lang="ts">
import moment from "moment";
import type { VForm } from "vuetify/components";
import type { BankOption, bs, ListForm } from "~/types/accounting.type";

export default defineNuxtComponent({
  setup() {
    const tab = ref(0);

    const form = useFormState({
      transac_date: moment().format("DD/MM/YYYY"),
      detail: "",
      dr: [
        {
          bank: {
            Bank_id: "",
            Bank_name: "",
            id_list_reference: 0,
            id_no: 0,
            id_seperate_type: "",
            title: "",
          },
          bank_separate: {
            Bank_id: "",
            Bank_name: "",
            date: "",
            id: 0,
            id_no: 0,
            id_seperate: "",
            id_seperate_type: "",
            id_type: 0,
            name_seperate: "",
            name_type: "",
            type_seperate: "",
            no: 0,
            title: "",
          },
          bank_separate_date: "",
          amount: "",
        },
      ] as ListForm[],
      cr: [
        {
          bank: {
            Bank_id: "",
            Bank_name: "",
            id_list_reference: 0,
            id_no: 0,
            id_seperate_type: "",
            title: "",
          },
          bank_separate: {
            Bank_id: "",
            Bank_name: "",
            date: "",
            id: 0,
            id_no: 0,
            id_seperate: "",
            id_seperate_type: "",
            id_type: 0,
            name_seperate: "",
            name_type: "",
            type_seperate: "",
            no: 0,
            title: "",
          },
          bank_separate_date: "",
          amount: "",
        },
      ] as ListForm[],
    });

    const options = ref({
      dr: [] as bs[],
      cr: [] as bs[],
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
    amountBalance() {
      const { dr, cr } = this.form.data;

      const dr_amount = dr.map((e) => Number(e.amount));
      const cr_amount = cr.map((e) => Number(e.amount));

      const sum_dr = dr_amount.reduce((a, b) => a + b, 0);
      const sum_cr = cr_amount.reduce((a, b) => a + b, 0);

      return {
        balance: sum_dr - sum_cr + 50,
        amount: sum_dr - sum_cr,
      };
    },
  },
  methods: {
    async getBankCr() {
      const bank_cr: BankOption[] = await this.$rest.options("bank-options", {
        mode: 3,
        type: "Cr",
      });

      this.options.cr = bank_cr.map((e) => ({
        ...e,
        title: `${e.Bank_id} ${e.Bank_name}`,
      }));
    },
    async getBankDr() {
      const bank_dr: BankOption[] = await this.$rest.options("bank-options", {
        mode: 3,
        type: "Dr",
      });

      this.options.dr = bank_dr.map((e) => ({
        ...e,
        title: `${e.Bank_id} ${e.Bank_name}`,
      }));
    },
    handleAddItem(name: "dr" | "cr") {
      const temp: ListForm = {
        bank: {
          Bank_id: "",
          Bank_name: "",
          id_list_reference: 0,
          id_no: 0,
          id_seperate_type: "",
          title: "",
        },
        bank_separate: {
          Bank_id: "",
          Bank_name: "",
          date: "",
          id: 0,
          id_no: 0,
          id_seperate: "",
          id_seperate_type: "",
          id_type: 0,
          name_seperate: "",
          name_type: "",
          type_seperate: "",
          no: 0,
          title: "",
        },
        bank_separate_date: "",
        amount: "",
      };

      this.form.data[name].push(temp);
    },
    handleClickDelete(name: "dr" | "cr", i: number) {
      const temp = this.form.data[name];
      temp.splice(i, 1);
      this.form.data[name] = temp;
    },
    async handleSubmit() {
      const { valid } = await this.formRef.validate();
      if (valid && this.amountBalance.amount === 0) {
        return { name: "other", result: this.form.data };
      }
      return null;
    },
    handleFormUpdate(name: "dr" | "cr", form: ListForm, i: number) {
      this.form.data[name][i] = form;
    },
  },
});
</script>

<style></style>
