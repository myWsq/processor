# Processor

> 一个轻量级的 JavaScript 数据处理工具.

[English](./README.md) | [简体中文](./README.zh-CN.md)

一般来说, 数据处理会在服务端进行, 前端通过 API 与服务端交互获得处理结果. 然而面对简单的数据时, 我们可以把这个工作交给浏览器来做, 这样可以有效减少网络请求的数量, 提升用户体验. 更重要的是, 开发起来非常容易.

**Processor** 就是一款帮助你在前端进行数据处理的工具.

## 安装

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

## 使用

首先, 你需要创建一个 `processor` 实例. 你可以在实例化时传入源数据.

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

或者创建完成后使用 `load` 方法提供数据.

```javascript
const processor = createProcessor();
processor.load(data);
```

### 监听 update 事件

调用 `onUpdate` 可以在 processor 实例上注册一个回调函数用于获取结果.

```javascript
processor.onUpdate((result) => {
  console.log(result);
});

// 结果
{
  current: [
     { name: "Michael Hall", age: 18, sex: "female" }
     ...
  ], // 当前的条目
  page: 1, // 当前是第几页
  pageCount: 4, // 总页数
  total: 4 // 条目总数
}
```

### 分页

`page(size?: number, current?: number) => Processor`

调用 `page` 方法可以设置每页最多的条目数量和当前页. 如果 `size` 被设置为一个小于等于 `0` 的数字, 则会返回全部条目.

```javascript
processor.page(1, 2); // maximum 1 entry per page and switch to second page.
processor.page(); // all of entries
```

### 排序

与 [lodash/orderby](https://lodash.com/docs/4.17.15#orderBy) 很像. 你也可以提供一个自定义的排序方法就像 `Array.sort`.

```javascript
processor.sort("name"); // single field asc
processor.sort("name", "desc"); // single field desc
processor.sort(["name", "age"]); // multiple fields asc
processor.sort(["name", "age"], ["acs", "desc"]); // multiple fields with different orders
processor.sort((a, b) => a > b); // custom sort function
```

### 搜索

`search(str: string, fields?: string[]) => Processor`

默认的搜索策略是 **"某条数据的任何字段匹配, 那么就认为这条数据是有效的"**. 你可以提供搜索的范围.

```javascript
processor.search("pat"); // 搜索全部字段
processor.search("pat", ["name"]); // 只搜索 "name" 字段
```

或者你也可以提供一个自定义的搜索策略.

```javascript
processor.search((entires) => [...]);
```

### Filter

`filter` 方法非常灵活, 你可以观察下面的示例代码.

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

这些筛选条件可以随意搭配.

### exec

立即计算并返回结果.

```javascript
const result = processor.page(2).filter({ sex: "female" }).search("Tho").exec();
```

## 如何与 Vue 配合使用

Processor 为 Vue 提供了两个包.

### Vue 2.x

首先, 你需要安装 [Composition API Plugin][https://github.com/vuejs/composition-api].

**npm**

```shell
$ npm install @vue/composition-api @processor/vue2
```

**yarn**

```shell
$ yarn add @vue/composition-api @processor/vue2
```

```javascript
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";

Vue.use(VueCompositionApi);
```

```html
<template>
  <div>
    {{result}}
  </div>
</template>

<script>
  import { useProcessor } from "@processor/vue2";

  export default {
    setup() {
      const data = [
        { name: "Patricia Clark", age: 16, sex: "male" },
        { name: "Michael Hall", age: 18, sex: "female" },
        { name: "Thomas Perez", age: 14, sex: "female" },
        { name: "Mark Taylor", age: 11, sex: "male" },
      ];
      const { processor, result } = useProcessor(data);
      processor.page(2);

      return {
        result,
      };
    },
  };
</script>
```

### Vue 3

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
const { processor, result } = useProcessor(data);
```

## 如何与 React 配合使用

**需要 react 版本 >=16.8.0.**

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
