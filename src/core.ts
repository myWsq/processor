export type DataHandler<T> = (data: T[]) => void;

export function createQuery<T>() {
  let data: T[] = [];
  const r = {
    load,
    search,
    filter,
    sort,
    data,
  };

  let _filter: DataHandler<T>;
  let _search: DataHandler<T>;
  let _sort: DataHandler<T>;

  function load(source: T[]) {
    data = source.concat();
    return r;
  }

  function filter(val: any) {
    const arr = data.concat();
    _filter = (d) => {
      console.log(d, val);
    };
    _sort && _sort(arr);
    return r;
  }

  function search() {
    return r;
  }

  function sort() {
    return r;
  }

  return r;
}
