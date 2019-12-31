import {
  FilterQuery,
  FilterFunction,
  SearchFunction,
  SortFunction,
  SortOrder
} from "./types";
import { filterData, searchData, paginateData } from "./utils";
import orderBy from "lodash.orderby";
import debounce from "lodash.debounce";

export default class QueryIt<T = any> {
  /**
   *
   * @param onChange On Update
   * @param wait Hooks debounce waiting time
   */
  constructor(onChange?: () => void, wait: number = 0) {
    function onUpdate() {
      onChange && onChange();
    }
    this.onUpdate = debounce(onUpdate, wait);
  }

  onUpdate: () => void;

  get items() {
    return paginateData(
      this._paginationCache,
      this._currentPage,
      this._pageSize
    );
  }
  /**
   * 未分页的记录总数
   */
  get total() {
    return this._paginationCache.length;
  }

  /**
   * 总页数
   */
  get pageCount() {
    return this._pageSize > 0 ? Math.ceil(this.total / this._pageSize) : 1;
  }

  get currentPage() {
    return this._currentPage;
  }

  get pageSize() {
    return this._pageSize;
  }

  setPageSize(pageSize: number) {
    this._pageSize = pageSize;
    this.onUpdate();
  }

  setCurrentPage(currentPage: number) {
    this._currentPage = currentPage;
    this._fixPageException();
    this.onUpdate();
  }

  load(source: T[]) {
    this._source = source;
    this._filterArgs = null;
    this._sortArgs = null;
    this._currentPage = 1;
    this.onUpdate();
  }

  sort(columns: string | string[], order: SortOrder | SortOrder[]): void;
  sort(callbackFn: SortFunction<T>): void;
  sort(callbackOrColumns: any, order?: any) {
    this._sortArgs = arguments;
    this._currentPage = 1;
    this._fixPageException();
    this.onUpdate();
  }

  search(text: string, columns?: string[]): void;
  search(callbackFn: SearchFunction<T>): void;
  search(callbackOrText: SearchFunction<T> | string, columns?: string[]) {
    this._searchArgs = arguments;
    this._currentPage = 1;
    this._fixPageException();
    this.onUpdate();
  }

  filter(query: FilterQuery<T>): void;
  filter(callbackFn: FilterFunction<T>): void;
  filter(callbackOrQuery: FilterQuery<T> | FilterFunction<T>) {
    this._filterArgs = arguments;
    this._currentPage = 1;
    this._fixPageException();
    this.onUpdate();
  }

  // Data
  private _source: T[] = [];

  // Param
  private _filterArgs: any;
  private _sortArgs: any;
  private _searchArgs: any;
  private _currentPage: number = 0;
  private _pageSize: number = -1;

  // Cache
  private get _sortingCache() {
    let result = this._source;
    if (this._filterArgs) {
      // @ts-ignore
      result = this._filter(result, ...this._filterArgs);
    }
    if (this._searchArgs) {
      // @ts-ignore
      result = this._search(result, ...this._searchArgs);
    }
    return result;
  }
  private get _paginationCache() {
    let result = this._sortingCache;
    if (this._sortArgs) {
      // @ts-ignore
      return this._sort(result, ...this._sortArgs);
    }
    return result;
  }

  private _search(data: T[], callbackFn: SearchFunction<T>): void;
  private _search(data: T[], text: string, columns?: string[]): void;
  private _search(
    data: T[],
    callbackOrText: SearchFunction<T> | string,
    columns?: string[]
  ) {
    // text
    if (typeof callbackOrText === "string") {
      return searchData(data, callbackOrText, columns);
      //callback
    } else {
      return [...callbackOrText(data)];
    }
  }
  private _filter(data: T[], query: FilterQuery<T>): T[];
  private _filter(data: T[], callbackFn: FilterFunction<T>): T[];
  private _filter(
    data: T[],
    callbackOrQuery: FilterQuery<T> | FilterFunction<T>
  ) {
    // query
    if (typeof callbackOrQuery === "function") {
      return data.filter(callbackOrQuery);
      // callback
    } else {
      return filterData(data, callbackOrQuery);
    }
  }

  private _sort(data: T[], callbackFn: SortFunction<T>): void;
  private _sort(
    data: T[],
    columns: string | string[],
    order: SortOrder | SortOrder[]
  ): void;
  private _sort(
    data: T[],
    callbackOrColumns: SortFunction<T> | string | string[],
    order?: SortOrder | SortOrder[]
  ) {
    // callback
    if (typeof callbackOrColumns === "function") {
      return data.sort(callbackOrColumns);
    } else {
      // columns
      return orderBy(data, callbackOrColumns, order);
    }
  }

  private _fixPageException() {
    if (this._currentPage > this.pageCount) {
      this._currentPage = this.pageCount;
    }
    if (this._currentPage < 1) {
      this._currentPage = 1;
    }
  }
}
