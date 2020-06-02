import { useMemo, useState } from "react";
import { createProcessor } from "@processor/core";

export function useProcessor<T>(data?: T[]) {
  const processor = useMemo(() => createProcessor(data), [data]);
  const [result, setResult] = useState(processor.exec());
  processor.onUpdate((res) => {
    setResult(res)
  });
  return [processor, result];
}
