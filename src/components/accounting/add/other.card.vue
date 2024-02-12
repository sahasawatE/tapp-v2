<template>
  <v-card width="100%" variant="outlined" color="grey-lighten-2">
    <v-card-title>
      <div
        class="pa-2 d-flex flex-row justify-space-between align-center t-text-black"
      >
        <span class="t-font-bold">
          {{ `${$props.name}. ${$props.index + 1}` }}
        </span>
        <v-btn
          icon="mdi-delete"
          variant="tonal"
          color="error"
          :disabled="!$props.canDelete"
          @click="handleClickDelete"
        ></v-btn>
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
        :rules="rules.bank"
        @update:model-value="getSeparate"
      >
      </v-autocomplete>
      <v-autocomplete
        v-if="bank_separate.length"
        v-model="form.data.bank_separate"
        item-title="title"
        item-value="id_id"
        label="ตัวแยก"
        :items="bank_separate"
        return-object
        :rules="rules.bank_separate"
      ></v-autocomplete>
      <common-datepicker
        v-else
        v-model="form.data.bank_separate_date"
        title="ตัวแยกธนาคาร"
        label="ตัวแยกธนาคาร"
        :rules="rules.bank_separate_date"
      />
      <v-text-field
        v-model="form.data.amount"
        label="จำนวนเงิน"
        append-inner-icon="mdi-currency-thb"
        type="number"
        :rules="rules.amount"
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import moment from "moment";
import type { PropType } from "vue";
import type {
  BankSeparateOption,
  bso,
  bs,
  ListForm,
} from "~/types/accounting.type";

export default defineNuxtComponent({
  setup() {
    const bank_separate = ref<bso[]>([]);
    const bank = ref<bs[]>([]);

    const form = useFormState<ListForm>({
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
      bank_separate_date: "",
      amount: "",
    });

    const rules = {
      bank: [(v: bs) => !!v.title || ""],
      bank_separate: [(v: bso) => !!v.title || ""],
      bank_separate_date: [(v: string) => !!v || ""],
      amount: [(v: string) => !!v || ""],
    };

    return {
      bank_separate,
      bank,
      form,
      rules,
    };
  },
  emits: {
    "click-delete": null,
    "update:form": null,
  },
  props: {
    bankOptions: {
      type: Array as PropType<bs[]>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    canDelete: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object as PropType<ListForm>,
      required: true,
    },
  },
  methods: {
    async getSeparate(e: bs) {
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
    handleClickDelete() {
      this.$emit("click-delete", this.$props.index);
    },
  },
  watch: {
    "form.data": {
      deep: true,
      handler(val: any) {
        this.$emit("update:form", val);
      },
    },
    "$props.bankOptions": {
      immediate: true,
      handler(val: bs[]) {
        this.bank = val;
      },
    },
    "$props.form": {
      deep: true,
      immediate: true,
      handler(val: ListForm) {
        this.form.data = val;
      },
    },
  },
});
</script>

<style></style>
