<template>
  <v-card width="100%" variant="outlined" color="grey-lighten-2">
    <v-card-title>
      <div
        class="pa-2 d-flex flex-row justify-space-between align-center t-text-black"
      >
        <span class="t-font-bold">Dr. 1</span>
        <v-btn icon="mdi-delete" variant="tonal" color="error" disabled></v-btn>
      </div>
    </v-card-title>
    <v-card-text class="d-flex flex-column t-gap-2 t-text-black">
      <v-autocomplete
        v-model="form.data.bank"
        label="ผังบัญชี"
        :items="bank"
        item-value="Bank_id"
        item-title="title"
        return-object
      >
      </v-autocomplete>
      <v-text-field
        v-model="form.data.amount"
        label="จำนวนเงิน"
        append-inner-icon="mdi-currency-thb"
        type="number"
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { BankSeparateOption, BankOption } from "~/types/accounting.type";

interface bso extends BankSeparateOption {
  no: number;
  title: string;
}
interface bs extends BankOption {
  title: string;
}

export default defineNuxtComponent({
  setup() {
    const bank_separate = ref<bso[]>([]);
    const bank = ref<bs[]>([]);

    const form = useFormState({
      bank: {
        Bank_id: "",
        Bank_name: "",
        id_list_reference: 0,
        id_no: 0,
        id_seperate_type: "",
        title: "",
      } as bs,
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
      amount: "",
    });

    return {
      bank_separate,
      bank,
      form,
    };
  },
  props: {
    bankOptions: {
      type: Array as PropType<BankOption[]>,
      required: true,
    },
  },
  watch: {
    "$props.bankOptions": {
      deep: true,
      handler(val: BankOption[]) {
        this.bank = val.map((e) => ({
          ...e,
          title: `${e.Bank_id} ${e.Bank_name}`,
        }));
      },
    },
  },
});
</script>

<style></style>
