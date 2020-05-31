// Types
export type SourceData = Record<string, any>;
export type OneOrMore<T> = T | T[];
export type DataHandler<T extends SourceData> = (data: T[]) => T[];
export type Result<T> = {
  current: T[];
  page: number;
  pageCount: number;
  total: number;
};
// Utils
function toArray(item: any) {
  return !(item instanceof Array) ? [item] : item;
}

function toString(item: any): string {
  return item.toString ? item.toString() : "";
}

function isEqual(target: any, expect: any): boolean {
  if (typeof expect === "function") {
    return expect(target);
  } else {
    return expect === target;
  }
}

// Main
export function createProcessor<T extends SourceData>(source?: T[]) {
  const store = {
    filter: {
      cache: [] as T[],
      shouldCacheUpdate: true,
      method: (data: T[]) => data,
      update() {
        store.filter.cache = store.filter.method(data);
      },
    },
    search: {
      cache: [] as T[],
      shouldCacheUpdate: true,
      method: (data: T[]) => data,
      update() {
        store.search.cache = store.search.method(store.filter.cache);
      },
    },
    sort: {
      cache: [] as T[],
      shouldCacheUpdate: true,
      method: (data: T[]) => data,
      update() {
        store.sort.cache = store.sort.method(store.search.cache);
      },
    },
    page: {
      cache: {
        current: [],
        page: 1,
        pageCount: 0,
        total: 0,
      } as Result<T>,
      shouldCacheUpdate: true,
      method: (data: T[]) => ({
        current: data,
        page: 1,
        pageCount: 1,
        total: data.length,
      }),
      update() {
        store.page.cache = store.page.method(store.sort.cache);
      },
    },
  };
  let data: T[] = source || [];
  const r = {
    load,
    search,
    filter,
    sort,
    page,
    exec,
  };

  function load(source: T[]) {
    data = source.concat();
    store.filter.shouldCacheUpdate = true;
    store.search.shouldCacheUpdate = true;
    store.sort.shouldCacheUpdate = true;
    store.page.shouldCacheUpdate = true;
    return r;
  }

  function filter(
    option: {
      [key in keyof T]?: OneOrMore<T[key] | ((val: T[key]) => boolean)>;
    }
  ) {
    store.filter.method = (d) => {
      return d.filter((item) =>
        Object.keys(option).every((field) => {
          const target = item[field];
          const expects = toArray(option[field]);
          return expects.some((expect) => isEqual(target, expect));
        })
      );
    };
    store.filter.shouldCacheUpdate = true;
    store.search.shouldCacheUpdate = true;
    store.sort.shouldCacheUpdate = true;
    store.page.shouldCacheUpdate = true;
    return r;
  }

  function search(
    searcher: string | ((val: T[]) => T[]),
    fields?: (keyof T)[]
  ) {
    store.search.method = (d) => {
      if (!searcher) {
        return d.concat();
      }
      if (typeof searcher === "function") {
        return searcher(d.concat());
      }
      return d.filter((item) => {
        const searchColumns = fields || Object.keys(item);
        const regexp = new RegExp(searcher, "i");
        return searchColumns.some(
          (column) => toString(item[column]).search(regexp) > -1
        );
      });
    };
    store.search.shouldCacheUpdate = true;
    store.sort.shouldCacheUpdate = true;
    store.page.shouldCacheUpdate = true;
    return r;
  }

  function sort(
    option: OneOrMore<keyof T> | ((a: T, b: T) => number),
    order?: OneOrMore<"acs" | "desc" | "ascing" | "descing">
  ) {
    store.sort.method = (d) => {
      d = d.concat();
      if (typeof option === "function") {
        return d.sort(option);
      } else {
        const options = toArray(option);
        const orders = toArray(order);
        const sorter = (a: any, b: any) =>
          options
            .map((o, i) => {
              const dir = ["acs", "ascing", undefined].includes(orders[i])
                ? 1
                : -1;
              return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
            })
            .reduce((p, n) => (p ? p : n), 0);
        d.sort(sorter);
        return d;
      }
    };
    store.sort.shouldCacheUpdate = true;
    store.page.shouldCacheUpdate = true;
    return r;
  }

  function page(current: number, size: number | "all" = "all") {
    store.page.method = (d) => {
      if (size === "all" || size <= 0) {
        return {
          current: d.concat(),
          page: 1,
          pageCount: 1,
          total: d.length,
        };
      }
      if (current < 1) {
        current = 1;
      }

      return {
        current: d.slice((current - 1) * size, current * size),
        page: current,
        total: d.length,
        pageCount: Math.ceil(d.length / size),
      };
    };
    store.page.shouldCacheUpdate = true;
    return r;
  }

  function exec() {
    Object.values(store).forEach((item) => {
      if (item.shouldCacheUpdate) {
        item.update();
        item.shouldCacheUpdate = false;
      }
    });
    return store.page.cache;
  }

  return r;
}
