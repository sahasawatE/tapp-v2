<template>
  <v-form ref="receive-form" lazy-validation>
    <div class="d-flex flex-column t-gap-4">
      <v-select
        v-model="form.data.type"
        :items="receipt"
        item-title="Receipt_name"
        item-value="Receipt_id"
        label="ประเภท"
        return-object
      ></v-select>
      <v-select
        v-model="form.data.type"
        :items="receipt"
        item-title="Receipt_name"
        item-value="Receipt_id"
        label="ผังบัญชี"
        return-object
      ></v-select>
      <common-datepicker />
      <v-textarea label="รายละเอียด"></v-textarea>
      <v-text-field
        label="จำนวนเงิน"
        append-inner-icon="mdi-currency-thb"
      ></v-text-field>
    </div>
  </v-form>
</template>

<script lang="ts">
import type { ReceiveOption } from "~/types/accounting.type";

export default defineNuxtComponent({
  setup() {
    const receipt = ref<ReceiveOption[]>([]);

    const form = useFormState({
      type: {
        Receipt: "",
        Receipt_name: "",
      } as ReceiveOption,
    });

    return {
      receipt,
      form,
    };
  },
  async mounted() {
    this.$store.setLoading(true);

    await this.getReciept();

    this.$store.setLoading(false);
  },
  methods: {
    async getReciept() {
      const receipt: ReceiveOption[] = await this.$rest.options("reciept");
      this.receipt = receipt;
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
