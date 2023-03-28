import {
  keyStringRegex,
  phoneNumberRegex,
} from "./constants/regularExpressions";

import lazyRetry from "./utils/lazyRetry";
import sanitizeUrl from "./utils/sanitizeUrl";
import isUuidError from "./utils/uuid";
import {
  identity,
  notEmpty,
  empty,
  getId,
  hasKey,
  getOrThrowError,
  deleteProperty,
  insertBetween,
  isStringTrue,
  emptyToNull,
  emptyToUndefined,
  uniqueItems,
  groupBy,
} from "./utils/util";

import useIsSmallScreen from "./hooks/useIsSmallScreen";

export {
  keyStringRegex,
  phoneNumberRegex,
  identity,
  notEmpty,
  empty,
  getId,
  hasKey,
  getOrThrowError,
  deleteProperty,
  insertBetween,
  isStringTrue,
  emptyToNull,
  emptyToUndefined,
  uniqueItems,
  lazyRetry,
  sanitizeUrl,
  isUuidError,
  useIsSmallScreen,
  groupBy,
};
