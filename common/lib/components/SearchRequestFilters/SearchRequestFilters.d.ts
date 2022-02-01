import * as React from "react";
import { Maybe, PoolCandidateFilter } from "../../api/generated";
export declare const FilterBlock: React.FunctionComponent<{
    title: string;
    content: Maybe<string> | Maybe<string[]>;
}>;
interface SearchRequestFiltersProps {
    poolCandidateFilter: Maybe<PoolCandidateFilter>;
}
export declare const SearchRequestFilters: React.FunctionComponent<SearchRequestFiltersProps>;
export default SearchRequestFilters;
