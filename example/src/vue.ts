import List from "../../src/query-it";
import { reactive, ref } from "@vue/composition-api";

export default function useQueryIt<T>(wait: number = 0) {
  const list = new List<T>(() => {
    items.value = list.items;
    currentPage.value = list.currentPage;
    pageSize.value = list.pageSize;
    pageCount.value = list.pageCount;
    total.value = list.total;
  }, wait);
  const items = ref(list.items);
  const currentPage = ref(list.currentPage);
  const pageSize = ref(list.pageSize);
  const pageCount = ref(list.pageCount);
  const total = ref(list.total);

  return reactive({
    load: list.load.bind(list),
    sort: list.sort.bind(list),
    filter: list.filter.bind(list),
    search: list.search.bind(list),
    setPageSize: list.setPageSize.bind(list),
    setCurrentPage: list.setCurrentPage.bind(list),
    items,
    currentPage,
    pageSize,
    pageCount,
    total
  });
}
