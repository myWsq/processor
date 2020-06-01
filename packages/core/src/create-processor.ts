// Types
// --------------------------------
export type SourceData = Record<string, any>;
export type OneOrMore<T> = T | T[];
export type DataHandler<T extends SourceData> = (data: T[]) => T[];
export interface Processor<T> {
  /**
   * Load new data.
   * @param source - New data
   */
  load: (source: T[]) => Processor<T>;
  /**
   * Search by text on multiple fields. Or you can provide a custom search function.
   *
   * @example
   * processor.search('ttt') // search on all fields
   * processor.search('ttt', ['name']) // search on 'name' fields
   * processor.search(data => data.filter(item => item.name === 'ttt')) // custom search function
   */
  search: (
    searcher: string | ((val: T[]) => T[]),
    fields?: (keyof T)[] | undefined
  ) => Processor<T>;
  /**
   * Filter by a query object
   *
   * @example
   * processor.filter({
   *   name: ["Paul Lee", "Donald Clark"] // name equal to "Paul Lee" or "Donald Clark"
   *   sex: "female", // and sex equal to "female"
   *   age: (val) => val > 18 // and age greater than 18
   * });
   */
  filter: (
    option: {
      [key in keyof T]?:
        | T[key]
        | ((val: T[key]) => boolean)
        | (T[key] | ((val: T[key]) => boolean))[];
    }
  ) => Processor<T>;
  /**
   * Same with [lodash/orderby](https://lodash.com/docs/4.17.15#orderBy). Or provide a custom sort function likes `Array.sort`
   *
   * @example
   * processor.sort("name"); // single field asc
   * processor.sort("name", "desc"); // single field desc
   * processor.sort(["name", "age"]); // multiple fields asc
   * processor.sort(["name", "age"], ["acs", "desc"]); // multiple fields with different orders
   */
  sort: (
    option: keyof T | (keyof T)[] | ((a: T, b: T) => number),
    order?:
      | "acs"
      | "desc"
      | "ascing"
      | "descing"
      | ("acs" | "desc" | "ascing" | "descing")[]
      | undefined
  ) => Processor<T>;
  /**
   * Page data.
   * @param size - Page size. Optional, if not provided,
   *               all data will be returned and the
   *               current page will be set to 1.
   *
   * @param current - Current page. Default 1.
   */
  page: (size?: number, current?: number) => Processor<T>;

  /**
   * Set callback function, it will be called when result update.
   *
   * @example
   * processor.onUpdate(result => {
   *  console.log(result);
   * })
   */
  onUpdate: (callback: OnUpdateCallback<T>) => Processor<T>;
  /**
   * Calculate immediately.
   */
  exec: () => Result<T>;
}
export interface Result<T> {
  /** Paged data */
  current: T[];
  /** Current page */
  page: number;
  /** Total number of page */
  pageCount: number;
  /** Total number of data handled by filter, search, sort  */
  total: number;
}
export type OnUpdateCallback<T> = (result: Result<T>) => void;

// Utils
// --------------------------------
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
// --------------------------------
/**
 * Create a processor instance.
 * @param source - Source data.
 * @param wait - debounce wating time (ms). Default 10.
 */
export function createProcessor<T extends SourceData>(
  source?: T[]
): Processor<T> {
  const state = {
    filter: {
      // cache
      cache: [] as T[],
      // default handler
      handler: (data: T[]) => data,
      // call this method to update cache
      update() {
        state.filter.cache = state.filter.handler(data); // use origin data
      },
    },
    search: {
      cache: [] as T[],
      handler: (data: T[]) => data,
      update() {
        state.search.cache = state.search.handler(state.filter.cache); // use filter cache
      },
    },
    sort: {
      cache: [] as T[],
      handler: (data: T[]) => data,
      update() {
        state.sort.cache = state.sort.handler(state.search.cache); // use search cache
      },
    },
    page: {
      cache: {
        current: [],
        page: 1,
        pageCount: 0,
        total: 0,
      } as Result<T>,
      handler: (data: T[]) => ({
        current: data,
        page: 1,
        pageCount: 1,
        total: data.length,
      }),
      update() {
        state.page.cache = state.page.handler(state.sort.cache); // use sort cache
      },
    },
  };

  // origin data
  let data: T[] = source || [];
  let onUpdateHandler: OnUpdateCallback<T> | null = null;

  // calculate state
  function calc(cacheKeys: (keyof typeof state)[]) {
    cacheKeys.forEach((key) => {
      state[key].update();
    });
    onUpdateHandler && onUpdateHandler(state.page.cache);
  }

  // processor instance
  const processor: Processor<T> = {
    // load
    load(source: T[]) {
      data = source.concat();
      calc(["filter", "search", "sort", "page"]);
      return processor;
    },
    // Filter
    filter(option) {
      state.filter.handler = (d) => {
        return d.filter((item) =>
          Object.keys(option).every((field) => {
            const target = item[field];
            const expects = toArray(option[field]);
            return expects.some((expect) => isEqual(target, expect));
          })
        );
      };
      calc(["filter", "search", "sort", "page"]);
      return processor;
    },
    // search
    search(searcher, fields) {
      state.search.handler = (d) => {
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
      calc(["search", "sort", "page"]);
      return processor;
    },
    // sort
    sort(option, order) {
      state.sort.handler = (d) => {
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
      calc(["sort", "page"]);
      return processor;
    },
    // page
    page(size, current = 1): typeof processor {
      state.page.handler = (d) => {
        const total = d.length;
        if (!size || size <= 0) {
          return {
            current: d.concat(),
            page: 1,
            pageCount: 1,
            total,
          };
        }
        if (current < 1) {
          current = 1;
        }
        const pageCount = Math.ceil(total / size);
        current = Math.min(current, pageCount);

        return {
          current: d.slice((current - 1) * size, current * size),
          page: current,
          total,
          pageCount,
        };
      };
      calc(["page"]);
      return processor;
    },
    onUpdate(func) {
      onUpdateHandler = func;
      return processor;
    },
    exec() {
      calc(["filter", "search", "sort", "page"]);
      return state.page.cache;
    },
  };

  return processor;
}
