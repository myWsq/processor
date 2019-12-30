export type FilterQuery<T> = {
  [key in keyof T]?: FilterOption<T[key]> | FilterOption<T[key]>[];
};

export type FilterOption<T> =
  | string
  | number
  | boolean
  | FilterOptionFunction<T>;

export type FilterOptionFunction<T> = (val: T) => boolean;

export type FilterFunction<T> = (
  value: T,
  index: number,
  array: T[]
) => boolean;

export type SearchFunction<T> = (array: T[]) => T[];

export type SortFunction<T> = (a: T, b: T) => number;

export type SortOrder = "asc" | "desc";
