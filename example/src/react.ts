import List from "../../src/query-it";
import { useMemo, useReducer } from "react";

export default function<T>() {
  const list = useMemo(
    () =>
      new List<T>(() => {
        forceUpdate();
      }),
    []
  );

  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  
  return list;
}
