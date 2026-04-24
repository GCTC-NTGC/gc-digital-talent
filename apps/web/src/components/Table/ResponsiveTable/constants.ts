import type { InitialState } from "./types";

export const INITIAL_STATE: InitialState = {
  hiddenColumnIds: [],
  paginationState: {
    pageIndex: 0,
    pageSize: 10,
  },
  sortState: [],
  searchState: {
    term: "",
    type: "",
  },
};

export const SEARCH_PARAM_KEY = {
  SEARCH_TERM: "st",
  SEARCH_COLUMN: "sc",
  HIDDEN_COLUMNS: "cv", // Note: Stands for "Column visibility"
  SORT_RULE: "sr",
  PAGE_SIZE: "ps",
  PAGE: "p",
  FILTERS: "f",
  POOL_FILTERS: "pool-filters", // owned by PoolTable
  POOL_CANDIDATE_FILTERS: "pool-candidate-filters", // owned by PoolCandidatesTable
} as const;
