import { Random } from "mockjs";

export function getSourceData(count: number) {
  return Array.from({ length: count }).map(() => {
    return {
      name: Random.name(),
      age: Random.natural(10, 20),
      email: Random.email(),
      sex: Random.pick(["female", "male"])
    };
  });
}

export function getSortOptions() {
  return [
    {
      label: "Youngest",
      value: ["age", "asc"]
    },
    {
      label: "Reserve youngest",
      value: ["age", "desc"]
    }
  ];
}

export function getFilterOptions() {
  return [
    {
      label: "All",
      value: ""
    },
    {
      label: "Female",
      value: "female"
    },
    {
      label: "Male",
      value: "male"
    }
  ];
}
