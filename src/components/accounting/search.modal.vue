<template>
  <div>
    <common-modal
      :active="$props.open"
      title="ค้นหาข้อมูลขั้นสูง"
      ok-text="ค้นหา"
      @close="$emit('close')"
      @save="handleClickSearch"
    >
      <div class="py-1">
        <v-row>
          <v-col cols="12">
            <v-card color="background">
              <v-card-text
                class="d-flex flex-row justify-space-between align-center"
              >
                <span class="t-text-lg">แสดงข้อมูลของวันนี้</span>
                <v-switch v-model="form.data.show_today"></v-switch>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card color="background">
              <v-card-text
                class="d-flex flex-row justify-space-between align-center"
              >
                <span class="t-text-lg">แสดงข้อมูลของทุกคน</span>
                <v-switch v-model="form.data.show_everyone"></v-switch>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card color="background">
              <v-card-text
                class="d-flex flex-row justify-space-between align-center"
              >
                <span class="t-text-lg">ไตรมาส</span>
                <div class="t-w-40">
                  <v-select
                    v-model="form.data.quarter"
                    color="secondary"
                    :items="options.quarter"
                  ></v-select>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <common-datepicker
              v-model="form.data.start_date"
              label="วันที่เริ่มต้น"
              title="วันที่เริ่มต้น"
            ></common-datepicker>
          </v-col>
          <v-col cols="12" md="6">
            <common-datepicker
              v-model="form.data.end_date"
              label="วันที่สิ้นสุด"
              title="วันที่สิ้นสุด"
            ></common-datepicker>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="form.data.separate"
              :items="options.separate"
              item-title="id_seperate"
              item-value="id"
              return-object
              label="ตัวแยก"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.data.ref"
              :items="options.ref"
              item-title="name_reference"
              item-value="id_reference"
              return-object
              label="ประเภท"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.data.user"
              :items="options.user"
              item-title="User_firstname"
              item-value="User_id"
              return-object
              label="ผู้บันทึก"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-card color="background">
              <v-card-text class="d-flex flex-row align-center t-gap-2">
                <div class="t-flex-1">
                  <v-select
                    v-model="form.data.bank_from"
                    :items="options.bank"
                    return-object
                    color="secondary"
                    item-value="id_no"
                    label="ผังบัญชี"
                    clearable
                  ></v-select>
                </div>
                <div>
                  <v-radio-group v-model="form.data.bank_condition" inline>
                    <v-radio label="ถึง" value="0"></v-radio>
                    <v-radio label="และ" value="1"></v-radio>
                  </v-radio-group>
                </div>
                <div class="t-flex-1">
                  <v-select
                    v-model="form.data.bank_to"
                    :items="options.bank"
                    return-object
                    color="secondary"
                    item-value="id_no"
                    label="ผังบัญชี"
                    clearable
                  ></v-select>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </common-modal>
  </div>
</template>

<script lang="ts">
import type {
  RefOption,
  UserOption,
  SeparateOption,
  ao,
  DeepSearchForm,
} from "~/types/accounting.type";

export default defineNuxtComponent({
  setup() {
    const options = ref({
      ref: [] as RefOption[],
      bank: [] as ao[],
      separate: [] as SeparateOption[],
      user: [] as UserOption[],
      quarter: [] as { title: string; value: string }[],
    });

    const form = useFormState<DeepSearchForm>({
      show_today: false,
      show_everyone: false,
      quarter: "",
      start_date: "",
      end_date: "",
      separate: {
        id: 0,
        id_seperate: "",
      } as SeparateOption,
      ref: {
        id_reference: 0,
        name_reference: "",
      } as RefOption,
      user: {
        User_firstname: "",
        User_id: "",
      } as UserOption,
      bank_condition: "",
      bank_from: {
        Bank_id: "",
        Bank_name: "",
        id_no: 0,
        title: "",
      } as ao,
      bank_to: {
        Bank_id: "",
        Bank_name: "",
        id_no: 0,
        title: "",
      } as ao,
    });

    return {
      options,
      form,
    };
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    search: null,
    close: null,
  },
  async mounted() {
    try {
      this.$store.setLoading(true);
      const [ref, bank, separate, user]: any[][] = await Promise.all([
        this.getOptions("ref"),
        this.getOptions("bank"),
        this.getOptions("seperate"),
        this.getOptions("user"),
      ]);
      this.options = {
        ref,
        bank: bank.map((e) => ({ ...e, title: `${e.Bank_id} ${e.Bank_name}` })),
        separate,
        user,
        quarter: [
          {
            value: "1",
            title: "ไตรมาส 1",
          },
          {
            value: "2",
            title: "ไตรมาส 2",
          },
          {
            value: "3",
            title: "ไตรมาส 3",
          },
          {
            value: "4",
            title: "ไตรมาส 4",
          },
        ],
      };
    } catch (err) {
      this.$dialog.toast.error(err as string);
    } finally {
      this.$store.setLoading(false);
    }
  },
  methods: {
    async getOptions(name: string) {
      return await this.$rest.options(name);
    },
    handleClickSearch() {
      this.$emit("search", {
        ...this.form.data,
        start_date:
          this.form.data.start_date === "Invalid date"
            ? ""
            : this.form.data.start_date,
        end_date:
          this.form.data.end_date === "Invalid date"
            ? ""
            : this.form.data.end_date,
      });
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
