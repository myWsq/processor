# Processor

[![CircleCI](https://circleci.com/gh/myWsq/processor.svg?style=shield)](https://app.circleci.com/pipelines/github/myWsq/processor) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@processor/core) ![npm (scoped)](https://img.shields.io/npm/v/@processor/core) ![NPM](https://img.shields.io/npm/l/@processor/core)

> A simple and lightweight JavaScript data processing tool.

English | [简体中文](./README.zh-CN.md)

Generally, data is processed by the server, and the frontend application interacts with the server through the API. However, when dealing with simple data, we can leave this work to the browser which can effectively reduce the number of network requests and improve the user experience. Moreover, it is very simple to develop.

**Processor** is such a tool which can help you processing data on the frontend.

## Installnation

**npm**

```shell
$ npm install @processor/core
```

**yarn**

```shell
$ yarn add @processor/core
```

**CDN**

[jsDelivr](https://www.jsdelivr.com/package/npm/@processor/core)

## Usage

First of all, you should create a instance of `processor`. You can pass by source data when created it.

```javascript
import { createProcessor } from "@processor/core";

const data = [
  { name: "Patricia Clark", age: 16, sex: "male" },
  { name: "Michael Hall", age: 18, sex: "female" },
  { name: "Thomas Perez", age: 14, sex: "female" },
  { name: "Mark Taylor", age: 11, sex: "male" },
];
const processor = createProcessor(data);
```

Or provide data later by method `load`.

```javascript
const processor = createProcessor();
processor.load(data);
```

### Listen update event

Call `onUpdate` to register callback function on processor instance to get the result after processing.

```javascript
processor.onUpdate((result) => {
  console.log(result);
});

// result
{
  current: [
     { name: "Michael Hall", age: 18, sex: "female" }
     ...
  ], // current entries
  page: 1, // current page number
  pageCount: 4, // page count
  total: 4 // total number of entries
}
```

### Pagination

`page(size?: number, current?: number) => Processor`

Call `page` to set the **maximum number** of entries per page and **current page number**. If `size` equal or less then `0`, it will return all of entries.

```javascript
processor.page(1, 2); // maximum 1 entry per page and switch to second page.
processor.page(); // all of entries
```

### Sort

Same with [lodash/orderby](https://lodash.com/docs/4.17.15#orderBy). You can also provide a custom sort function like `Array.sort`

```javascript
processor.sort("name"); // single field asc
processor.sort("name", "desc"); // single field desc
processor.sort(["name", "age"]); // multiple fields asc
processor.sort(["name", "age"], ["acs", "desc"]); // multiple fields with different orders
processor.sort((a, b) => a > b); // custom sort function
```

### Search

`search(str: string, fields?: string[]) => Processor`

The default search strategy is **"If any field of entry matched, it is considered valid"**. You can provide a searching range.

```javascript
processor.search("pat"); // search all of fields
processor.search("pat", ["name"]); // only search field "name"
```

Or you can also provide a custom search strategy.

```javascript
processor.search((entires) => [...]);
```

### Filter

The `filter` is a quite flexible method, just see the example code below.

```javascript
// name === "Patricia Clark"
processor.filter({ name: "Patricia Clark" });
// name === "Patricia Clark" || name === "Michael Hall"
processor.filter({ name: ["Patricia Clark", "Michael Hall"] });
// age > 16
processor.filter({ age: (val) => val > 16 });
// sex === "female" && age > 16
processor.filter({ sex: "female", age: (val) => val > 16 });
```

The filter conditions can be combined at you will.

### exec

Calculate immediately and return the result.

```javascript
const result = processor.page(2).filter({ sex: "female" }).search("Tho").exec();
```

## How to use with Vue

From v2.0, it works for Vue 2 & 3 within a single package by the power of [Vue Demi](https://github.com/vueuse/vue-demi)!

For **Vue 2.x**, you should install the [Composition API Plugin](https://github.com/vuejs/composition-api) before.

**npm**

```shell
$ npm install @vue/composition-api
```

**yarn**

```shell
$ yarn add @vue/composition-api
```

```javascript
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";

Vue.use(VueCompositionApi);
```

### Usage

**npm**

```shell
$ npm install @processor/vue
```

**yarn**

```shell
$ yarn add @processor/vue
```

```javascript
import { useProcessor } from "@processor/vue";
import { reactive } from "vue";

const config = reactive({
  source: [], // source data
  searchOption: "", // first argument of process.search()
  searchFields: [], // second argument of process.search()
  filterOption: {}, // argument of process.filter()
  sortOption: "", // first argument of process.sort()
  sortOrder: "", // second argument of process.sort()
  pageSize: "", // first argument of process.page()
});
const {
  data,
  total,
  pageCount,
  currentPage, // this ref can be changed
} = useProcessor();
```

Change config to process data.

```html
<input v-model="config.searchOption">
<button @click="currentPage++">next</button>
```

## How to use with React

**Need react version >=16.8.0.**

**npm**

```shell
$ npm install @processor/react
```

**yarn**

```shell
$ yarn add @processor/react
```

```javascript
import { useProcessor } from "@processor/react";
const { processor, result } = useProcessor(data);
```
