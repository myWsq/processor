<template>
  <div>
    <p>total: {{result.total}}</p>
    <input placeholder="Search by name" v-model="nameSearchInput">
    <table>
      <th>
        <td>id</td>
        <td>name</td>
        <td>age</td>
      </th>
      <tr v-for="row in result.current" :key="row.id">
        <td>{{row.id}}</td>
        <td>{{row.name}}</td>
        <td>{{row.age}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { useProcessor } from "./useProcessor";
import Mock from "mockjs";
import { ref, watch, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const data = Mock.mock({
      "list|300": [
        {
          "id|+1": 1,
          name: "@NAME",
          "age|15-21": 15
        }
      ]
    });
    const { processor, result } = useProcessor(data.list);
    processor.page(20).exec();
    const nameSearchInput = ref("");
    watch(nameSearchInput, val => {
      processor.search(val, ["name"]).exec();
    });

    return {
      result,
      nameSearchInput
    };
  }
});
</script>

<style>
</style>