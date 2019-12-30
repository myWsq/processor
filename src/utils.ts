import { FilterQuery } from "./types";

function isEqual(target: any, expect: any): boolean {
  if (typeof expect === "function") {
    return expect(target);
  } else {
    return expect === target;
  }
}

export function filterData(data: any[], query: FilterQuery<any>) {
  return data.filter(item =>
    Object.keys(query).every(field => {
      if (item.hasOwnProperty(field)) {
        const target = item[field];
        const expect = query[field];
        if (expect instanceof Array) {
          if (!expect.length) {
            return true;
          }
          return expect.some(expect => isEqual(target, expect));
        } else {
          if (!expect) {
            return true;
          }
          return isEqual(target, expect);
        }
      } else {
        return false;
      }
    })
  );
}

export function searchData(data: any[], text: string, columns?: any[]) {
  if(!text) {
    return [...data];
  }
  const regexp = new RegExp(text, "i");
  if (columns) {
    return data.filter(item =>
      columns.some(column => item[column].toString().search(regexp) > -1)
    );
  } else {
    return data.filter(item =>
      Object.keys(item).some(
        column => item[column].toString().search(regexp) > -1
      )
    );
  }
}

export function paginateData(data: any[], current: number, size?: number) {
  if (size === undefined || size < 0) {
    return [...data];
  }
  if (current < 1) {
    current = 1;
  }
  return data.slice((current - 1) * size, current * size);
}
