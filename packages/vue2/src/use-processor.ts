import { reactive } from "@vue/composition-api";
import { createProcessor } from "@processor/core";
export function useProcessor<T>(data?: T[]) {
  const processor = createProcessor(data);
  const result = reactive(processor.exec());
  processor.onUpdate((res) => {
    for (const key in res) {
      result[key] = res[key];
    }
  });
  return {
    processor,
    result,
  };
}
