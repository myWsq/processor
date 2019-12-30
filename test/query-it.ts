import Query from "../dist/query-it.js";

const query = new Query();

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

