<template>
  <div>
    <common-modal
      :active="$props.open"
      title="เพิ่มข้อมูล"
      only-close
      @close="$emit('close')"
    >
      <div>
        <div class="d-flex md:t-flex-row t-flex-col t-gap-4">
          <v-card
            v-for="(m, i) in menus"
            :key="i"
            :color="m.color"
            class="t-drop-shadow-md t-flex-1"
            @click="handleClickMenu(i)"
          >
            <v-img :src="m.img" height="120" cover></v-img>
            <v-card-text>
              {{ m.title }}
            </v-card-text>
          </v-card>
        </div>
      </div>
    </common-modal>

    <accounting-add-form-modal
      :open="selected_menu > -1"
      :selected-menu="selected_menu"
      @close="selected_menu = -1"
    />
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    submit: null,
    close: null,
  },
  data() {
    return {
      menus: [
        {
          title: "รายรับ",
          img: "https://www.godigit.com/content/dam/godigit/directportal/lifehm/how-to-earn-money-in-childhood.jpg",
          color: "success",
        },
        {
          title: "รายจ่าย",
          img: "https://www.icicidirect.com/images//Art%20of%20spending%20money-202307211426165278195.png",
          color: "error",
        },
        {
          title: "อื่น ๆ",
          img: "https://media.freshbooks.com/wp-content/uploads/2022/01/what-is-billing-information.jpg",
          color: "secondary",
        },
      ],
      selected_menu: -1,
    };
  },
  methods: {
    handleClickMenu(index: number) {
      this.selected_menu = index;
    },
  },
  watch: {
    "$props.open": {
      immediate: true,
      handler(val: boolean) {
        if (val) {
          this.selected_menu = -1;
        }
      },
    },
  },
});
</script>

<style></style>
