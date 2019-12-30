import React, { useEffect, useMemo } from "react";
import useList from "./react";
import Pagination from "bulma-pagination-react";

import { getSourceData } from "./utils";

const App = () => {
  const sourceData = useMemo(getSourceData, []);

  const list = useList<typeof sourceData[0]>();
  useEffect(() => {
    list.load(sourceData);
    // @ts-ignore
    onSortAge("asc");
    list.setPageSize(10);
  }, []);

  function onSortAge(order: "asc" | "desc") {
    list.sort("age", order);
  }

  function onFilterSex(val: string) {
    list.filter({
      sex: val
    });
  }

  function onSearchNameAndEmail(val: string) {
    list.search(val, ["name", "email"]);
  }

  function onPaginate(currentPage: number) {
    list.setCurrentPage(currentPage);
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
          <label className="label">Total: {list.total}</label>
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
            {list.items.map(item => (
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
          pages={list.pageCount}
          currentPage={list.currentPage}
          onChange={page => onPaginate(page)}
        ></Pagination>
      </div>
    </div>
  );
};

export default App;
