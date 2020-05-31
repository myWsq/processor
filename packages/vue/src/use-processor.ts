import { ref, reactive } from "vue";
import { createProcessor } from "@processor/core";
export function useProcessor<T>(data?: T[]) {
  const processor = createProcessor(data);
  const result = ref(processor.exec());

  processor.exec = () => {
    const res = processor.exec();
    result.value = res;
    return res;
  };

  return reactive({
    processor,
    result,
  });
}
