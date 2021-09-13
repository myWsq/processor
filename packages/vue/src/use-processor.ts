import { Ref, watch, ref, isReactive, readonly } from "vue-demi";
import { createProcessor, Processor, SourceData } from "@processor/core";

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

  watch(
    () => config.source,
    (val) => {
      if (!val) {
        data.value = null;
        total.value = 0;
        currentPage.value = 0;
        pageSize.value = 0;
      } else {
        core.load(val);
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    [() => config.searchOption, config.searchFields],
    ([option, fields]) => {
      if (option !== undefined) {
        core.search(option, fields);
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    () => config.filterOption,
    (option) => {
      if (option) {
        core.filter(option);
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  watch(
    [() => config.sortOption, () => config.sortOrder],
    ([option, order]) => {
      core.sort(option, order);
    },
    { immediate: true }
  );

  watch(
    [() => config.pageSize, currentPage],
    ([size, current]) => {
      core.page(size, current);
    },
    { immediate: true }
  );

  core.onUpdate((res) => {
    data.value = res.current;
    total.value = res.total;
    currentPage.value = res.page;
    pageCount.value = res.pageCount;
  });

  return {
    data: readonly(data),
    total: readonly(total),
    pageCount: readonly(pageCount),
    currentPage,
  };
}
