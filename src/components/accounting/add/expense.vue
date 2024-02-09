<template>
  <v-form ref="receive-form" lazy-validation>
    <div class="d-flex flex-column t-gap-4">
      <v-select
        v-model="form.data.type"
        :items="expense"
        item-title="Expanse_name"
        item-value="Expanse_id"
        label="ประเภท"
        return-object
        :rules="rules.type"
        @update:model-value="getBank"
      ></v-select>
      <v-select
        v-model="form.data.bank"
        :items="bank"
        item-title="Bank_name"
        item-value="Bank_id"
        label="ผังบัญชี"
        return-object
        :rules="rules.bank"
        @update:model-value="getSepaarate"
      ></v-select>
      <common-datepicker
        v-model="form.data.transac_date"
        title="วันทำรายการ"
        label="วันทำรายการ"
      />
      <v-autocomplete
        v-if="bank_separate.length"
        v-model="form.data.bank_separate"
        density="comfortable"
        variant="outlined"
        item-title="title"
        item-value="id_id"
        label="ตัวแยก"
        :items="bank_separate"
        hide-details
        return-object
        :rules="rules.bs"
      ></v-autocomplete>
      <common-datepicker
        v-else
        v-model="form.data.bank_separate_date"
        title="ตัวแยกธนาคาร"
        label="ตัวแยกธนาคาร"
        :rules="rules.bsd"
      />
      <v-textarea v-model="form.data.detail" label="รายละเอียด"></v-textarea>
      <v-text-field
        v-model="form.data.amount"
        label="จำนวนเงิน"
        append-inner-icon="mdi-currency-thb"
        type="number"
        :rules="rules.amount"
      ></v-text-field>
    </div>
  </v-form>
</template>

<script lang="ts">
import moment from "moment";
import type { VForm } from "vuetify/components";
import type {
  BankOption,
  BankSeparateOption,
  ExpenseOption,
} from "~/types/accounting.type";

interface bso extends BankSeparateOption {
  no: number;
  title: string;
}

export default defineNuxtComponent({
  setup() {
    const expense = ref<ExpenseOption[]>([]);
    const bank = ref<BankOption[]>([]);
    const bank_separate = ref<bso[]>([]);

    const form = useFormState({
      type: {
        Expanse_id: "",
        Expanse_name: "",
      } as ExpenseOption,
      bank: {
        Bank_id: "",
        Bank_name: "",
        id_list_reference: 0,
        id_no: 0,
        id_seperate_type: "",
      } as BankOption,
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
      } as bso,
      bank_separate_date: "",
      amount: "",
      detail: "",
      transac_date: moment().format("DD/MM/YYYY"),
    });

    const rules = {
      type: [(v: ExpenseOption) => !!v.Expanse_name || ""],
      bank: [(v: BankOption) => !!v.Bank_name || ""],
      bs: [(v: bso) => !!v.title || ""],
      bsd: [(v: string) => !!v || ""],
      amount: [(v: string) => !!v || ""],
    };

    return {
      expense,
      bank,
      bank_separate,
      form,
      rules,
    };
  },
  async mounted() {
    this.$store.setLoading(true);

    await this.getExpense();

    this.$store.setLoading(false);
  },
  computed: {
    formRef() {
      const ref = this.$refs["receive-form"] as VForm;

      return ref;
    },
  },
  methods: {
    async getExpense() {
      const expense: ExpenseOption[] = await this.$rest.options("expanse");
      this.expense = expense;
    },
    async getBank(e: ExpenseOption) {
      this.form.data.bank = {
        Bank_id: "",
        Bank_name: "",
        id_list_reference: 0,
        id_no: 0,
        id_seperate_type: "",
      };

      this.$store.setLoading(true);

      const type = e.Expanse_name.split(" ")[1];
      const bank: BankOption[] = await this.$rest.options("bank-options", {
        mode: 2,
        type,
      });
      this.bank = bank;

      this.$store.setLoading(false);
    },
    async getSepaarate(e: BankOption) {
      this.form.data.bank_separate = {
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
      };
      this.form.data.bank_separate_date = "";

      this.$store.setLoading(true);

      const bank_separate: BankSeparateOption[] = await this.$rest.options(
        "bank-seperate",
        {
          bank: e.Bank_id,
        },
      );

      if (bank_separate.length > 0) {
        this.bank_separate = bank_separate.map((e, i) => ({
          ...e,
          no: i,
          title: `${e.id_seperate} ${e.name_seperate}`,
        }));
      } else {
        this.form.data.bank_separate_date = moment().format("DD/MM/YYYY");
      }

      this.$store.setLoading(false);
    },
    async handleSubmit() {
      const { valid } = await this.formRef.validate();
      if (valid) {
        return this.form.data;
      }
      return null;
    },
  },
  watch: {
    "$props.open": {
      immediate: true,
      handler(val: boolean) {
        if (val) {
          this.form.reset();
        }
      },
    },
  },
});
</script>

<style></style>
