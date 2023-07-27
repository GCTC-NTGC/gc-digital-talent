type Row<T> = {
  original: T;
};

export type Cell<T> = {
  row: Row<T>;
  value: string;
};
