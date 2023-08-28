/* eslint-disable import/prefer-default-export */
import { User } from "@gc-digital-talent/graphql";

type PartialUser = Pick<User, "experiences">;

export function isIncomplete({ experiences }: PartialUser): boolean {
  return !experiences?.length;
}
