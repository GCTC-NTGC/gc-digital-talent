import type { AwardedScope } from "@gc-digital-talent/graphql";
import { AwardedTo } from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface AwardFields {
  title?: string | null;
  awardedDate?: string | null;
  issuedBy?: string | null;
  awardedTo?: LocalizedEnumValue<AwardedTo> | null;
  awardedScope?: LocalizedEnumValue<AwardedScope> | null;
  projectName?: string | null;
  details?: string | null;
}

export function hasEmptyRequiredFields({
  title,
  awardedDate,
  issuedBy,
  awardedTo,
  awardedScope,
  projectName,
  details,
}: AwardFields): boolean {
  return !!(
    !title ||
    !awardedDate ||
    !issuedBy ||
    !awardedTo?.value ||
    !awardedScope?.value ||
    !details ||
    (awardedTo.value === AwardedTo.MyProject && !projectName)
  );
}
