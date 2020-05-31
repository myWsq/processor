import { createQuery } from "./core";
const data = [
  { name: "test1", age: 16 },
  { name: "test0", age: 18 },
  { name: "test2", age: 14 },
  { name: "test1", age: 11 },
];

test("load", () => {
  const query = createQuery();
  query.load(data);
  expect(query.exec().current).toEqual(data);
});

describe("Baisc filter", () => {
  const query = createQuery(data);

  test("single field with single condition", () => {
    query.filter({ name: "test0" });
    expect(query.exec().current).toEqual([data[1]]);
  });

  test("single field with multiple condition", () => {
    query.filter({ name: ["test0", "test1"] });
    expect(query.exec().current).toEqual([data[0], data[1], data[3]]);
  });

  test("multiple field with single condition", () => {
    query.filter({ name: "test0", age: 16 });
    expect(query.exec().current).toEqual([]);
  });

  test("multiple field with multiple conditions", () => {
    query.filter({ name: ["test0", "test2"], age: [11, 14] });
    expect(query.exec().current).toEqual([data[2]]);
  });

  test("with callback function", () => {
    query.filter({ name: ["test0", "test1"], age: (val) => val > 17 });
    expect(query.exec().current).toEqual([data[1]]);
  });
});

describe("Basic search", () => {
  const query = createQuery(data);

  test("search text on all of fields", () => {
    query.search("test0");
    expect(query.exec().current).toEqual([data[1]]);
  });

  test("search text on some fields", () => {
    query.search("test0", ["age"]);
    expect(query.exec().current).toEqual([]);
  });

  test("search by callback function", () => {
    query.search((val) => {
      return [val[0]];
    });
    expect(query.exec().current).toEqual([data[0]]);
  });
});

describe("Basic sort", () => {
  const query = createQuery(data);

  test("single field asc", () => {
    query.sort("name");
    expect(query.exec().current).toEqual([data[1], data[0], data[3], data[2]]);
  });

  test("single field desc", () => {
    query.sort("name", "desc");
    expect(query.exec().current).toEqual([data[2], data[0], data[3], data[1]]);
  });

  test("multiple fields asc", () => {
    query.sort(["name", "age"]);
    expect(query.exec().current).toEqual([data[1], data[3], data[0], data[2]]);
  });

  test("multiple fields with different orders", () => {
    query.sort(["name", "age"], ["acs", "desc"]);
    expect(query.exec().current).toEqual([data[1], data[0], data[3], data[2]]);
  });
});

describe("Basic page", () => {
  const query = createQuery(data);

  test("paging", () => {
    query.page(2, 1);
    expect(query.exec().current).toEqual([data[1]]);
    expect(query.exec().page).toEqual(2);
    expect(query.exec().pageCount).toEqual(4);
    expect(query.exec().total).toEqual(4);
  });

  test("invalid page", () => {
    query.page(3, -1);
    expect(query.exec().page).toEqual(1);
    expect(query.exec().pageCount).toEqual(1);
  });
});

describe("Chain", () => {
  test("filter and search", () => {
    const query = createQuery(data);
    query.filter({ name: "test1" }).search("11");
    expect(query.exec().current).toEqual([data[3]]);
  });

  test("search and sort", () => {
    const query = createQuery(data);
    query.search("test1").sort("age");
    expect(query.exec().current).toEqual([data[3], data[0]]);
  });

  test("search and sort page", () => {
    const query = createQuery(data);
    query.search("test1").sort("age").page(2, 1);
    expect(query.exec().current).toEqual([data[0]]);
  });
});
