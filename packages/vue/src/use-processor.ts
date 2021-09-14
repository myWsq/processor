import { Ref, watch, ref, isReactive, onBeforeMount } from "vue-demi";
import {
  createProcessor,
  Processor,
  Result,
  SourceData,
} from "@processor/core";

export type useProcessorConfig<T> = {
  source: T[] | null | undefined;
  searchOption?: Parameters<Processor<T>["search"]>[0];
  searchFields?: Parameters<Processor<T>["search"]>[1];
  filterOption?: Parameters<Processor<T>["filter"]>[0];
  sortOption?: Parameters<Processor<T>["sort"]>[0];
  sortOrder?: Parameters<Processor<T>["sort"]>[1];
  pageSize?: number;
};

export function useProcessor<T extends SourceData>(
  config: useProcessorConfig<T>
) {
  if (!isReactive(config)) {
    throw new Error("config must be a reactive object");
  }

  const core = createProcessor<T>();
  const data: Ref<T[]> | Ref<null> = ref<T[] | null>(null);
  const total = ref<number>(0);
  const currentPage = ref(0);
  const pageSize = ref(0);
  const pageCount = ref(0);

  function handleSource() {
    if (!config.source) {
      data.value = null;
      total.value = 0;
      currentPage.value = 0;
      pageSize.value = 0;
    } else {
      core.load(config.source);
    }
  }

  function handleSearch() {
    if (config.searchOption !== undefined) {
      core.search(config.searchOption, config.searchFields);
    }
  }

  function handleFilter() {
    if (config.filterOption) {
      core.filter(config.filterOption);
    }
  }

  function handleSort() {
    if (config.sortOption) {
      core.sort(config.sortOption, config.sortOrder);
    }
  }

  function handlePaginate() {
    core.page(config.pageSize, currentPage.value);
  }

  function handleResult(result: Result<T>) {
    data.value = result.current;
    total.value = result.total;
    currentPage.value = result.page;
    pageCount.value = result.pageCount;
  }

  watch(() => config.source, handleSource, {
    deep: true,
  });

  watch([() => config.searchOption, config.searchFields], handleSearch, {
    deep: true,
  });

  watch(() => config.filterOption, handleFilter, {
    deep: true,
  });

  watch([() => config.sortOption, () => config.sortOrder], handleSort, {
    deep: true,
  });

  watch([() => config.pageSize, currentPage], handlePaginate);

  core.onUpdate(handleResult);

  onBeforeMount(() => {
    handleSource();
    handleSearch();
    handleFilter();
    handleSort();
    handlePaginate();
    handleResult(core.exec());
  });

  return {
    data,
    total,
    currentPage,
    pageCount,
  };
}
