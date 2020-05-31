import { createQuery } from "./core";

const query = createQuery();
const data = [
  { name: "test1", age: 16 },
  { name: "test0", age: 18 },
  { name: "test2", age: 14 },
];
test("load", () => {
  query.load(data);
  console.log(query.data);
  expect(query.data).toBeDefined();
});
