<template>
  <div>
    <div class="filter-row uk-padding-small">
      <button
        class="uk-button uk-button-default reload-button"
        @click="loadSource"
      >
        Reload
      </button>
      <!-- search -->
      <div class="search-input uk-inline">
        <span class="uk-form-icon" uk-icon="icon: search"></span>
        <input
          class="uk-input"
          type="search"
          placeholder="Search by name..."
          v-model="config.searchOption"
        />
      </div>
      <!-- sex filter -->
      <select
        class="uk-select filter-selector"
        v-model="config.filterOption.sex"
      >
        <option :value="undefined">Sex: All</option>
        <option value="male">Sex: Male</option>
        <option value="female">Sex: Female</option>
      </select>
      <!-- sort -->
      <select class="uk-select filter-selector" v-model="config.sortOption">
        <option value="id">Sort by ID</option>
        <option value="age">Sort by age</option>
      </select>
    </div>
    <!-- main table -->
    <table class="uk-table uk-table-striped">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>sex</th>
          <th>age</th>
        </tr>
      </thead>

      <tbody v-if="total">
        <tr v-for="row in data" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.sex }}</td>
          <td>{{ row.age }}</td>
        </tr>
      </tbody>
      <td v-else>
        No data
      </td>
    </table>
    <!-- pagination -->
    <div class="table-footer">
      <div>
        <span> Total: {{ total }} </span>
        <select class="uk-select page-size-selector" v-model="config.pageSize">
          <option :value="30">30 / page</option>
          <option :value="50">50 / page</option>
          <option :value="100">100 / page</option>
        </select>
      </div>
      <ul class="uk-pagination uk-flex-middle">
        <li :class="{ 'uk-disabled': prevDisabled }" @click="prev">
          <a href="#"><span uk-pagination-previous></span> Previous</a>
        </li>
        <li>{{ currentPage }}/{{ pageCount }}</li>
        <li :class="{ 'uk-disabled': nextDisabled }" @click="next">
          <a href="#">Next <span uk-pagination-next></span></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useProcessor } from "@processor/vue";
import Mock from "mockjs";
import { defineComponent, reactive, computed } from "vue";

export default defineComponent({
  setup() {
    const config = reactive({
      source: [],
      searchOption: "",
      searchFields: ["name"],
      filterOption: {
        sex: undefined,
      },
      sortOption: "id",
      pageSize: 30,
    });

    const { pageCount, currentPage, total, data } = useProcessor(config);

    const prevDisabled = computed(() => currentPage.value === 1);
    const nextDisabled = computed(() => currentPage.value === pageCount.value);

    function next() {
      currentPage.value++;
    }

    function prev() {
      currentPage.value--;
    }

    function loadSource() {
      config.source = Mock.mock({
        "list|3000": [
          {
            "id|+1": 1,
            name: "@NAME",
            age: () => Mock.Random.integer(15, 21),
            sex: () => Mock.Random.pick("male", "female"),
          },
        ],
      }).list;
    }

    loadSource();

    return {
      config,
      pageCount,
      currentPage,
      prevDisabled,
      nextDisabled,
      next,
      prev,
      total,
      data,
      loadSource,
    };
  },
});
</script>

<style scoped>
.filter-row {
  position: sticky;
  top: 0;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
}
.filter-selector {
  width: 12em;
  margin-left: 1em;
}
.search-input {
  flex-grow: 1;
}
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e5e5;
  padding: 0 1em;
  position: sticky;
  bottom: 0;
  background: #fff;
}
.page-size-selector {
  width: 8em;
  margin-left: 1em;
}
.reload-button {
  margin-right: 1em;
}
</style>
