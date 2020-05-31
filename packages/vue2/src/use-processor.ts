import { ref, reactive } from "@vue/composition-api";
import { createProcessor, Result } from "@processor/core";
export function useProcessor<T>(data?: T[]) {
  const processor = createProcessor(data);
  const result = ref<Result<T>>(processor.exec());

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
