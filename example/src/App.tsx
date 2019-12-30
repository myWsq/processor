import React, { useEffect, useMemo, useReducer } from "react";
import Pagination from "bulma-pagination-react";

import { getSourceData } from "./utils";
import QueryIt from "../../src/query-it";

function useQueryIt<T>(wait: number = 0) {
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

const App = () => {
  const sourceData = useMemo(() => getSourceData(500), []);

  const query = useQueryIt<typeof sourceData[0]>();
  useEffect(() => {
    query.load(sourceData);
    // @ts-ignore
    onSortAge("asc");
    query.setPageSize(10);
  }, []);

  function onSortAge(order: "asc" | "desc") {
    query.sort("age", order);
  }

  function onFilterSex(val: string) {
    query.filter({
      sex: val
    });
  }

  function onSearchNameAndEmail(val: string) {
    query.search(val, ["name", "email"]);
  }

  function onPaginate(currentPage: number) {
    query.setCurrentPage(currentPage);
  }

  return (
    <div>
      <div className="container">
        <h1 className="title">React Hooks</h1>
        <div className="filter-row">
          <input
            className="input search"
            placeholder="Search name or email..."
            onInput={e => {
              onSearchNameAndEmail(e.currentTarget.value);
            }}
          ></input>
          <label className="label">Total: {query.total}</label>
          <div className="spacer"></div>
          <div className="select">
            <select
              onChange={e => {
                // @ts-ignore
                onSortAge(e.currentTarget.value);
              }}
            >
              <option value="asc">Youngest</option>
              <option value="desc">Reserve youngest</option>
            </select>
          </div>
          <div className="select">
            <select
              onChange={e => {
                onFilterSex(e.currentTarget.value);
              }}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>email</th>
              <th>sex</th>
            </tr>
          </thead>
          <tbody>
            {query.items.map(item => (
              <tr>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.email}</td>
                <td>{item.sex}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pages={query.pageCount}
          currentPage={query.currentPage}
          onChange={page => onPaginate(page)}
        ></Pagination>
      </div>
    </div>
  );
};

export default App;
