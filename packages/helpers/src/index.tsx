import {
  keyStringRegex,
  phoneNumberRegex,
  workEmailDomainRegex,
} from "./constants/regularExpressions";
import buildMailToUri from "./utils/buildMailToUri";
import normalizeString from "./utils/normalizeString";
import sanitizeUrl from "./utils/sanitizeUrl";
import isUuidError from "./utils/uuid";
import {
  assertUnreachable,
  notEmpty,
  empty,
  getId,
  hasKey,
  getOrThrowError,
  deleteProperty,
  insertBetween,
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
  notEmpty,
  empty,
  getId,
  hasKey,
  getOrThrowError,
  deleteProperty,
  insertBetween,
  emptyToNull,
  emptyToUndefined,
  uniqueItems,
  buildMailToUri,
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
