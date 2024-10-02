import {
  keyStringRegex,
  phoneNumberRegex,
  workEmailDomainRegex,
} from "./constants/regularExpressions";
import lazyRetry from "./utils/lazyRetry";
import normalizeString from "./utils/normalizeString";
import sanitizeUrl from "./utils/sanitizeUrl";
import isUuidError from "./utils/uuid";
import {
  assertUnreachable,
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
  pickMap,
  unpackMaybes,
  localizedEnumHasValue,
} from "./utils/util";
import useIsSmallScreen from "./hooks/useIsSmallScreen";
import { GraphqlType } from "./types/graphql";
import { NotFoundError, UnauthorizedError } from "./errors";

export {
  assertUnreachable,
  keyStringRegex,
  phoneNumberRegex,
  workEmailDomainRegex,
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
  normalizeString,
  sanitizeUrl,
  isUuidError,
  useIsSmallScreen,
  groupBy,
  pickMap,
  unpackMaybes,
  localizedEnumHasValue,
  NotFoundError,
  UnauthorizedError,
};
export type { GraphqlType };
