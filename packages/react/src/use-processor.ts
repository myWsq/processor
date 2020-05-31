import { useMemo, useState } from "react";
import { createProcessor } from "@processor/core";
export function useProcessor<T>(data?: T[]) {
  const processor = useMemo(() => createProcessor(data), []);
  const [result, setResult] = useState(processor.exec());

  processor.exec = () => {
    const res = processor.exec();
    setResult(res);
    return res;
  };

  return [processor, result];
}
