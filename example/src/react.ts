import List from "../../src/query-it";
import { useMemo, useReducer } from "react";

export default function useQueryIt<T>(wait: number = 0) {
  const list = useMemo(
    () =>
      new List<T>(() => {
        forceUpdate();
      }, wait),
    []
  );

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return list;
}
