# Query-it

[![CircleCI](https://circleci.com/gh/myWsq/query-it.svg?style=svg)](https://circleci.com/gh/myWsq/query-it)![Size badge](https://img.shields.io/bundlephobia/minzip/query-it) ![License badge](https://img.shields.io/github/license/myWsq/query-it)

> Pure Javascript  data processing tool. Including filter, sort, search, paginate. 

[Live Demo](https://mywsq.github.io/query-it/)

## Install

**Node.js** or **webpack**

```shell
$ npm install query-it -S
```

**CDN**

[JsDelivr](https://www.jsdelivr.com/package/npm/query-it?path=dist)

## Usage examples

[example](https://github.com/myWsq/query-it/tree/master/example)

### Simple

```js
import QueryIt from "query-it";

const query = new QueryIt();

const SOURCE_DATA = [
  {
    name: "Donald Clark",
    age: 21
  },
  {
    name: "Paul Lee",
    age: 22
  },
  {
    name: "Ruth Rodriguez",
    age: 19
  }
];
query.load(SOURCE_DATA);
query.sort("age", "desc");

console.log(query.items);

// [
//   { name: "Paul Lee", age: 22 },
//   { name: "Donald Clark", age: 21 },
//   { name: "Ruth Rodriguez", age: 19 }
// ];
```

Or CDN

```js
const QueryIt = window.QueryIt.default;
const query = new QueryIt()
```

### Hooks

Apply a callback function and debounce waiting time (default 0).

```js
const query = new QueryIt(() => {
  console.log("changed");
}, 300);
```

### Props

| Name        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| items       | Displayed data. Readonly                                     |
| total       | The amount of data before paginating. Default 0. Readonly    |
| pageCount   | Total pages count. Default 1. Readonly                       |
| currentPage | Current page number. Default1. Readonly.                     |
| pageSize    | Maximum number per page. Default -1. Readonly. if less than 0, it will get all of data. |

### Methods

#### load

Loading source data and init states. 

#### search

Searching by text and fields. 

```js
query.search("pa", ["name"]); // field name or email including "pa"
```

You can also provide your custom search strategy.

```js
query.search(arr => {
  return arr.filter(item => item.name.indexOf("pa") > -1);
});
```

#### filter

Filtering by query object.

```js
// name equal to "Paul Lee" or "Donald Clark"
// and sex equal to "female" 
// and age greater than 18
query.filter({
  name: ["Paul Lee", "Donald Clark"]
  sex: "female",
  age: (val) => val > 18
});
```

Also apply a filter function likes `Array.filter`

#### sort

Same with [lodash/orderby](https://lodash.com/docs/4.17.15#orderBy). Or provide a custom sort function likes `Array.sort`

#### setCurrentPage

Set current page number.

```js
query.setCurrentPage(2)
```

If the current page number is greater than page count.  The current page number will be set to page count.

#### setPageSize

Set the page size.

```js
query.setPageSize(5)
```

if less than 0, it means get all of data.

## Usage with Javascript framework

#### React

There is an awesome way to use with react hooks.

```typescript
import QueryIt from "query-it";
import { useMemo, useReducer } from "react";

export default function useQueryIt<T>(wait: number = 0) {
  const query = useMemo(
    () =>
      new QueryIt<T>(() => {
        forceUpdate();
      }, wait),
    []
  );

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return query;
}
```

And just use it normally.

#### Vue

By `Vue.observable` or `vue-composition-api`. And I think the `vue-composition-api` seems to be the most pupular way to write vue project in future.

```js
import QueryIt from "query-it";
import { reactive } from "@vue/composition-api";

export function useQueryIt<T>() {
  const query = new QueryIt();
  return reactive(query)
}
```

It should work well but unfortunately doesn't. Because the `reactive` rewrite the original reactivity. So we need to declare some new reactive state.

```js
import QueryIt from "../../src/query-it";
import { reactive } from "@vue/composition-api";

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
```

It is not an elegant solution but worked. 🤕