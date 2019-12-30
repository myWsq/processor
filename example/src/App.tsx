import React, { useEffect, useMemo } from "react";
import useList from "./react";
import Pagination from "bulma-pagination-react";

import { getSourceData, getSortOptions, getFilterOptions } from "./utils";

const App = () => {
  const sourceData = useMemo(getSourceData, []);
  const sortOptions = useMemo(getSortOptions, []);
  const filterOptions = useMemo(getFilterOptions, []);
  const list = useList<typeof sourceData[0]>();
  useEffect(() => {
    list.load(sourceData);
    // @ts-ignore
    list.sort(...sortOptions[0].value);
    list.setPageSize(10);
  }, []);
  return (
    <div>
      <div className="container">
        <h1 className="title">React Hooks</h1>
        <div className="filter-row">
          <input
            className="input search"
            placeholder="Search name or email..."
            onInput={e => {
              list.search(e.currentTarget.value, ["name", "email"]);
            }}
          ></input>
          <label className="label">Total: {list.total}</label>
          <div className="spacer"></div>
          <div className="select">
            <select
              onChange={e => {
                //@ts-ignore
                list.sort(...e.currentTarget.value.split(","));
              }}
            >
              {sortOptions.map(item => (
                <option value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div className="select">
            <select
              onChange={e => {
                list.filter({
                  sex: e.currentTarget.value
                });
              }}
            >
              {filterOptions.map(item => (
                <option value={item.value}>{item.label}</option>
              ))}
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
          onChange={page => list.setCurrentPage(page)}
        ></Pagination>
      </div>
    </div>
  );
};

export default App;
