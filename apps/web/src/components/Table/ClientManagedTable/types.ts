export type IndividualRow<T> = {
  original: T;
};

export type IndividualCell<T> = {
  row: IndividualRow<T>;
  value: string;
};
