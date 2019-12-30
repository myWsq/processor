import QueryIt from "../../src/query-it";
import { reactive, ref } from "@vue/composition-api";

export default function useQueryIt<T>(wait: number = 0) {
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
