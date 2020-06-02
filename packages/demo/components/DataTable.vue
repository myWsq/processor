<template>
  <div>
    <div class="filter-row uk-padding-small">
      <!-- search -->
      <div class="search-input uk-inline">
        <span class="uk-form-icon" uk-icon="icon: search"></span>
        <input
          class="uk-input"
          type="search"
          placeholder="Search by name..."
          v-model="nameSearchInput"
        />
      </div>
      <!-- sex filter -->
      <select class="uk-select filter-selector" v-model="sexFilter">
        <option :value="undefined">Sex: All</option>
        <option value="male">Sex: Male</option>
        <option value="female">Sex: Female</option>
      </select>
      <!-- sort -->
      <select class="uk-select filter-selector" v-model="sortArgs">
        <option :value="['id']">Sort by ID</option>
        <option :value="['age']">Sort by age</option>
        <option :value="['age', 'desc']">Sort by age reverse</option>
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

      <tbody v-if="result.total">
        <tr v-for="row in result.current" :key="row.id">
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
        <span> Total: {{ result.total }} </span>
        <select class="uk-select page-size-selector" v-model="pageSize">
          <option :value="30">30 / page</option>
          <option :value="50">50 / page</option>
          <option :value="100">100 / page</option>
        </select>
      </div>
      <ul class="uk-pagination uk-flex-middle">
        <li :class="{ 'uk-disabled': prevDisabled }" @click="prev">
          <a href="#"><span uk-pagination-previous></span> Previous</a>
        </li>
        <li>{{ result.page }}/{{ result.pageCount }}</li>
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
import { ref, watch, defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    const data = Mock.mock({
      "list|3000": [
        {
          "id|+1": 1,
          name: "@NAME",
          age: () => Mock.Random.integer(15, 21),
          sex: () => Mock.Random.pick("male", "female"),
        },
      ],
    });
    const { processor, result } = useProcessor(data.list);
    const nameSearchInput = ref("");
    const pageSize = ref(30);
    const sortArgs = ref(["id"]);
    const sexFilter = ref(undefined);
    const prevDisabled = computed(() => result.page === 1);
    const nextDisabled = computed(() => result.page === result.pageCount);

    function next() {
      processor.page(pageSize.value, result.page + 1);
    }

    function prev() {
      processor.page(pageSize.value, result.page - 1);
    }

    watch(
      pageSize,
      (val) => {
        processor.page(val);
      },
      {
        immediate: true,
      }
    );
    watch(nameSearchInput, (val) => {
      processor.search(val, ["name"]);
    });
    watch(sortArgs, (val) => {
      processor.sort(...val);
    });
    watch(sexFilter, (val) => {
      processor.filter({
        sex: val,
      });
    });

    return {
      result,
      nameSearchInput,
      pageSize,
      sortArgs,
      sexFilter,
      prevDisabled,
      nextDisabled,
      next,
      prev,
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
</style>
