<template>
  <div v-if="$props.data.length > 0">
    <v-data-table
      :headers="$props.headers"
      :items="$props.data"
      :items-per-page="-1"
    >
      <template
        v-for="({ title, key }, index) in $props.headers"
        :key="index"
        #[`header.${key}`]="{ isSorted, column, sortBy }"
      >
        <div>
          <v-icon
            v-if="isSorted(column) && sortBy[0].key === key && $props.sortable"
            color="white"
            class="pr-2"
          >
            {{ getSortIcon(sortBy[0].order) }}
          </v-icon>
          <span class="text-white font-weight-black">{{ title }}</span>
        </div>
      </template>
      <template
        v-for="({ key }, i) in $props.headers"
        :key="i"
        #[`item.${key}`]="{ item, index }: { item: any; index: number }"
      >
        <div>
          <slot
            :name="[`data.${key}`]"
            v-bind="item[key]"
            :data="item"
            :this-data="item[key]"
            :index="index"
          >
            {{ item[key] }}
          </slot>
        </div>
      </template>
      <template #bottom> </template>
    </v-data-table>
  </div>
  <div v-else>
    <slot name="nodata">
      <common-no-data />
    </slot>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { HeaderProp } from "~/types/table.type";

export default defineNuxtComponent({
  props: {
    headers: {
      type: Array as PropType<HeaderProp>,
      required: true,
    },
    data: {
      type: Array as PropType<any[]>,
      required: true,
    },
    sortable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: {
    "update:paging": null,
  },
  data() {
    return {
      items: this.$props.data,
    };
  },
  methods: {
    getSortIcon(mode: any) {
      switch (mode) {
        case "asc":
          return "ph ph-sort-ascending";

        case "desc":
          return "ph ph-sort-descending";

        default:
          return "";
      }
    },
  },
});
</script>

<style></style>
