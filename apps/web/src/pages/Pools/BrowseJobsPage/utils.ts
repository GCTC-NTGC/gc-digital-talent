import { PublishingGroup, type Pool } from "@gc-digital-talent/graphql";

interface PartialPool {
  publishingGroup?: Pool["publishingGroup"];
}

// the pool is OK to show on the browse jobs pages
export function canShowOnBrowseJobs(p: PartialPool): boolean {
  return (
    p.publishingGroup?.value === PublishingGroup.ItJobs ||
    p.publishingGroup?.value === PublishingGroup.ExecutiveJobs
  );
}
