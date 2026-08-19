import { PublishingGroup } from "@gc-digital-talent/graphql";

// the pool is OK to show on the browse jobs pages
export function canShowOnBrowseJobs(
  publishingGroup: PublishingGroup | null | undefined,
): boolean {
  return (
    publishingGroup === PublishingGroup.ItJobs ||
    publishingGroup === PublishingGroup.ExecutiveJobs
  );
}
