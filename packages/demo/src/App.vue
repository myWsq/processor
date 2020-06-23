<template>
  <div>
    <nav class="uk-padding-small">
      <div class="nav-item">
        <span class="uk-text-lead">Processor</span>
        <span class="description uk-text-meta"
          >A simple and lightweight JavaScript data processing tool</span
        >
      </div>
      <div class="nav-item">
        <a
          class="uk-link-muted"
          href="https://github.com/myWsq/processor"
          target="_blank"
          >Github / Documentation</a
        >
        <a
          class="uk-link-muted"
          href="https://github.com/myWsq/processor/tree/master/packages/demo"
          target="_blank"
          >Demo Source Code</a
        >
      </div>
    </nav>
    <main>
      <DataTable></DataTable>
    </main>
  </div>
</template>

<script>
import { ref, watch, defineComponent, computed } from "vue";
import DataTable from "../components/DataTable.vue";
export default defineComponent({
  components: {
    DataTable,
  },
  setup() {},
});
</script>

<style scoped>
nav {
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  background: rgb(29, 29, 29);
}

nav .uk-text-lead {
  color: #fff;
}
nav .uk-link-muted {
  color: #fff;
}
.nav-item {
  display: flex;
  align-items: center;
}
.description {
  margin-left: 1em;
}
a + a {
  margin-left: 1em;
}
</style>
