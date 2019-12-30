
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
        v-for="item in list.items"
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
import useList from "./vue";

export default createComponent({
  setup() {
    const sourceData = getSourceData(15);
    const list = useList<typeof sourceData[0]>();

    const filter = reactive({
      sex: ""
    });

    const searchText = ref("");

    onMounted(() => {
      list.load(sourceData);
    });

    function onSortAge(order: "asc" | "desc") {
      list.sort("age", order);
    }

    function onFilterSex(val: string) {
      filter.sex = val;
      list.filter({
        sex: val
      });
    }

    function onSearchNameAndEmail(val: string) {
      list.search(val, ["name", "email"]);
    }

    return {
      list,
      filter,
      searchText,
      onSortAge,
      onFilterSex,
      onSearchNameAndEmail
    };
  }
});
</script>
<style lang="scss" scoped>
</style>