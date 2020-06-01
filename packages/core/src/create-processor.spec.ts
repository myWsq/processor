import { createProcessor } from "./create-processor";
const data = [
  { name: "test1", age: 16 },
  { name: "test0", age: 18 },
  { name: "test2", age: 14 },
  { name: "test1", age: 11 },
];

test("load", () => {
  const processor = createProcessor();
  processor.load(data);
  expect(processor.exec().current).toEqual(data);
});

describe("Baisc filter", () => {
  const processor = createProcessor(data);

  test("single field with single condition", () => {
    processor.filter({ name: "test0" });
    expect(processor.exec().current).toEqual([data[1]]);
  });

  test("single field with multiple condition", () => {
    processor.filter({ name: ["test0", "test1"] });
    expect(processor.exec().current).toEqual([data[0], data[1], data[3]]);
  });

  test("multiple field with single condition", () => {
    processor.filter({ name: "test0", age: 16 });
    expect(processor.exec().current).toEqual([]);
  });

  test("multiple field with multiple conditions", () => {
    processor.filter({ name: ["test0", "test2"], age: [11, 14] });
    expect(processor.exec().current).toEqual([data[2]]);
  });

  test("with callback function", () => {
    processor.filter({ name: ["test0", "test1"], age: (val) => val > 17 });
    expect(processor.exec().current).toEqual([data[1]]);
  });
});

describe("Basic search", () => {
  const processor = createProcessor(data);

  test("search text on all of fields", () => {
    processor.search("test0");
    expect(processor.exec().current).toEqual([data[1]]);
  });

  test("search text on some fields", () => {
    processor.search("test0", ["age"]);
    expect(processor.exec().current).toEqual([]);
  });

  test("search by callback function", () => {
    processor.search((val) => {
      return [val[0]];
    });
    expect(processor.exec().current).toEqual([data[0]]);
  });
});

describe("Basic sort", () => {
  const processor = createProcessor(data);

  test("single field asc", () => {
    processor.sort("name");
    expect(processor.exec().current).toEqual([
      data[1],
      data[0],
      data[3],
      data[2],
    ]);
  });

  test("single field desc", () => {
    processor.sort("name", "desc");
    expect(processor.exec().current).toEqual([
      data[2],
      data[0],
      data[3],
      data[1],
    ]);
  });

  test("multiple fields asc", () => {
    processor.sort(["name", "age"]);
    expect(processor.exec().current).toEqual([
      data[1],
      data[3],
      data[0],
      data[2],
    ]);
  });

  test("multiple fields with different orders", () => {
    processor.sort(["name", "age"], ["acs", "desc"]);
    expect(processor.exec().current).toEqual([
      data[1],
      data[0],
      data[3],
      data[2],
    ]);
  });
});

describe("Basic page", () => {
  const processor = createProcessor(data);

  test("paging", () => {
    processor.page(1, 2);
    expect(processor.exec().current).toEqual([data[1]]);
    expect(processor.exec().page).toEqual(2);
    expect(processor.exec().pageCount).toEqual(4);
    expect(processor.exec().total).toEqual(4);
  });

  test("all data", () => {
    processor.page();
    expect(processor.exec().page).toEqual(1);
    expect(processor.exec().pageCount).toEqual(1);
  });
});

describe("Chain", () => {
  test("filter and search", () => {
    const processor = createProcessor(data);
    processor.filter({ name: "test1" }).search("11");
    expect(processor.exec().current).toEqual([data[3]]);
  });

  test("search and sort", () => {
    const processor = createProcessor(data);
    processor.search("test1").sort("age");
    expect(processor.exec().current).toEqual([data[3], data[0]]);
  });

  test("search and sort page", () => {
    const processor = createProcessor(data);
    processor.search("test1").sort("age").page(1, 2);
    expect(processor.exec().current).toEqual([data[0]]);
  });
});
