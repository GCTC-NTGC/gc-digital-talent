import { Experience } from "@gc-digital-talent/graphql";

type Experiences = Pick<Experience, "id">[] | undefined | null;

export function isIncomplete(experiences: Experiences): boolean {
  return !experiences?.length;
}
