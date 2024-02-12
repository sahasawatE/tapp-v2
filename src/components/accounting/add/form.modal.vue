<template>
  <div>
    <common-modal
      :active="$props.open"
      :title="title"
      @close="$emit('close')"
      @save="handleSave"
    >
      <div>
        <accounting-add-receive
          v-if="$props.selectedMenu === 0"
          ref="add-form"
        />
        <accounting-add-expense
          v-if="$props.selectedMenu === 1"
          ref="add-form"
        />
        <accounting-add-other v-if="$props.selectedMenu === 2" ref="add-form" />
      </div>
    </common-modal>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import type {
  ExpenseForm,
  OtherForm,
  ReceiveForm,
} from "~/types/accounting.type";

export default defineNuxtComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    selectedMenu: {
      type: Number,
      required: true,
    },
  },
  emits: {
    close: null,
    submit: null,
  },
  data() {
    return {};
  },
  computed: {
    title() {
      switch (this.$props.selectedMenu) {
        case -1:
          return "";

        case 0:
          return "รายรับ";

        case 1:
          return "รายจ่าย";

        case 2:
          return "อื่น ๆ";

        default:
          return "";
      }
    },
    formRef() {
      const ref = this.$refs["add-form"] as any;
      return ref;
    },
  },
  methods: {
    async handleSave() {
      try {
        this.$store.setLoading(true);
        const form: {
          name: "other" | "receive" | "expense";
          result: any;
        } | null = await this.formRef.handleSubmit();
        if (form && this.$store.getUser) {
          switch (form.name) {
            case "receive":
              await this.handleReceive(form.result);
              break;

            case "expense":
              await this.handleExpense(form.result);
              break;

            case "other":
              await this.handleOther(form.result);
              break;

            default:
              this.$dialog.toast.error("ไม่มีข้อมูล");
              break;
          }
        }
        this.$emit("submit");
      } catch (err) {
        this.$dialog.toast.error(err as string);
      } finally {
        this.$store.setLoading(false);
      }
    },
    async handleReceive(form: ReceiveForm) {
      const param = {
        id: moment().format("YYYYMMDDHHmmss"),
        transac_date: moment().format("YYYY-MM-DD"),
        transac_time: moment().format("HH:mm:ss"),
        user_id: this.$store.getUser!.User_id,
        type: String(form.bank.id_list_reference),
        separator: form.bank_separate_date
          ? moment(form.bank_separate_date, "DD/MM/YYYY").format("YYYY-MM-DD")
          : form.bank_separate.id_seperate,
        detail: form.detail,
        amount: form.amount,
        acc_id: form.bank.Bank_id,
        branch_id: this.$store.getUser!.User_branch,
        history_date: moment(form.transac_date, "DD/MM/YYYY").format(
          "YYYY-MM-DD",
        ),
        img: null,
      };

      await this.$rest.post("report/add/resceive", param);
      this.$dialog.toast.success("บันทึกข้อมูลสำเร็จ");
    },
    async handleExpense(form: ExpenseForm) {
      const param = {
        id: moment().format("YYYYMMDDHHmmss"),
        transac_date: moment().format("YYYY-MM-DD"),
        transac_time: moment().format("HH:mm:ss"),
        user_id: this.$store.getUser!.User_id,
        type: String(form.bank.id_list_reference),
        separator: form.bank_separate_date
          ? moment(form.bank_separate_date, "DD/MM/YYYY").format("YYYY-MM-DD")
          : form.bank_separate.id_seperate,
        detail: form.detail,
        amount: form.amount,
        acc_id: form.bank.Bank_id,
        branch_id: this.$store.getUser!.User_branch,
        history_date: moment(form.transac_date, "DD/MM/YYYY").format(
          "YYYY-MM-DD",
        ),
        img: null,
      };

      await this.$rest.post("report/add/expense", param);
      this.$dialog.toast.success("บันทึกข้อมูลสำเร็จ");
    },
    async handleOther(form: OtherForm) {
      const dr_param = form.dr.map((e, i) => ({
        id: `${moment().format("YYYYMMDDHHmmss")}DR${i + 1}`,
        transac_date: moment().format("YYYY-MM-DD"),
        transac_time: moment().format("HH:mm:ss"),
        user_id: this.$store.getUser!.User_id,
        type: String(e.bank.id_list_reference),
        separator: e.bank_separate_date
          ? moment(e.bank_separate_date, "DD/MM/YYYY").format("YYYY-MM-DD")
          : e.bank_separate.id_seperate,
        detail: form.detail,
        amount: e.amount,
        acc_id: e.bank.Bank_id,
        branch_id: this.$store.getUser!.User_branch,
        history_date: moment(form.transac_date, "DD/MM/YYYY").format(
          "YYYY-MM-DD",
        ),
      }));
      const cr_param = form.cr.map((e, i) => ({
        id: `${moment().format("YYYYMMDDHHmmss")}CR${i + 1}`,
        transac_date: moment().format("YYYY-MM-DD"),
        transac_time: moment().format("HH:mm:ss"),
        user_id: this.$store.getUser!.User_id,
        type: String(e.bank.id_list_reference),
        separator: e.bank_separate_date
          ? moment(e.bank_separate_date, "DD/MM/YYYY").format("YYYY-MM-DD")
          : e.bank_separate.id_seperate,
        detail: form.detail,
        amount: `-${e.amount}`,
        acc_id: e.bank.Bank_id,
        branch_id: this.$store.getUser!.User_branch,
        history_date: moment(form.transac_date, "DD/MM/YYYY").format(
          "YYYY-MM-DD",
        ),
      }));

      const post = [...dr_param, ...cr_param].map(
        async (e) => await this.$rest.post("/report/add/other", e),
      );
      await Promise.all(post);
    },
  },
});
</script>

<style></style>
