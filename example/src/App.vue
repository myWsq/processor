
<template>
  <div class="container">
    <h1 class="title">Vue Composition API</h1>
    <article class="panel is-primary">
      <p class="panel-heading">
        Information
      </p>
      <p class="panel-tabs">
        <a :class="{ 'is-active': filter.sex === '' }" @click="onFilterSex('')"
          >All</a
        >
        <a
          :class="{ 'is-active': filter.sex === 'male' }"
          @click="onFilterSex('male')"
          >Male</a
        >
        <a
          :class="{ 'is-active': filter.sex === 'female' }"
          @click="onFilterSex('female')"
          >Female</a
        >
      </p>
      <div class="panel-block">
        <input
          class="input"
          placeholder="Search name or email..."
          @input="e => onSearchNameAndEmail(e.target.value)"
        />
      </div>
      <a
        class="panel-block"
        v-for="item in query.items"
        :key="item.name + item.email"
      >
        <div class="level-item name">
          <div>
            <p class="heading">
              Name
            </p>
            <p>
              {{ item.name }}
            </p>
          </div>
        </div>
        <div class="level-item">
          <div>
            <p class="heading">
              Age
            </p>
            <p>
              {{ item.age }}
            </p>
          </div>
        </div>
        <div class="level-item">
          <div>
            <p class="heading">
              Sex
            </p>
            <p>
              {{ item.sex }}
            </p>
          </div>
        </div>
        <div class="level-item">
          <div>
            <p class="heading">
              Email
            </p>
            <p>
              {{ item.email }}
            </p>
          </div>
        </div>
      </a>
    </article>
  </div>
</template>
<script lang="ts">
import {
  createComponent,
  reactive,
  onMounted,
  ref
} from "@vue/composition-api";
import { getSourceData } from "./utils";

import QueryIt from "../../src/query-it";

function useQueryIt<T>(wait: number = 0) {
  const query = new QueryIt<T>(() => {
    items.value = query.items;
    currentPage.value = query.currentPage;
    pageSize.value = query.pageSize;
    pageCount.value = query.pageCount;
    total.value = query.total;
  }, wait);
  const items = ref(query.items);
  const currentPage = ref(query.currentPage);
  const pageSize = ref(query.pageSize);
  const pageCount = ref(query.pageCount);
  const total = ref(query.total);

  return reactive({
    load: query.load.bind(query),
    sort: query.sort.bind(query),
    filter: query.filter.bind(query),
    search: query.search.bind(query),
    setPageSize: query.setPageSize.bind(query),
    setCurrentPage: query.setCurrentPage.bind(query),
    items,
    currentPage,
    pageSize,
    pageCount,
    total
  });
}

export default createComponent({
  setup() {
    const sourceData = getSourceData(15);
    const query = useQueryIt<typeof sourceData[0]>();

    const filter = reactive({
      sex: ""
    });

    onMounted(() => {
      query.load(sourceData);
    });

    function onSortAge(order: "asc" | "desc") {
      query.sort("age", order);
    }

    function onFilterSex(val: string) {
      filter.sex = val;
      query.filter({
        sex: val
      });
    }

    function onSearchNameAndEmail(val: string) {
      query.search(val, ["name", "email"]);
    }

    return {
      query,
      filter,
      onSortAge,
      onFilterSex,
      onSearchNameAndEmail
    };
  }
});
</script>
<style lang="scss" scoped>
</style>