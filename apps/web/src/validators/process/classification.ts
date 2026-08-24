import type {
  LocalizedString,
  PoolAreaOfSelection,
  PoolOpportunityLength,
  PublishingGroup,
} from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface NullStateFields {
  workStream?: { id: string } | null;
  name?: LocalizedString | null;
  publishingGroup?: LocalizedEnumValue<PublishingGroup> | null;
}

/*
  Checks null state for advertisement details section of edit pool page.
  Note: The pool.classification should not be null, therefore it doesn't need to checked
*/
export function isInNullState({
  workStream,
  name,
  publishingGroup,
}: NullStateFields): boolean {
  return !!(
    !workStream &&
    !name?.en &&
    !name?.fr &&
    !publishingGroup &&
    !publishingGroup
  );
}

interface ClassificationFields extends NullStateFields {
  areaOfSelection?: LocalizedEnumValue<PoolAreaOfSelection> | null;
  classification?: { id: string } | null;
  department?: { id: string } | null;
  opportunityLength?: LocalizedEnumValue<PoolOpportunityLength> | null;
}

export function hasEmptyRequiredFields({
  areaOfSelection,
  classification,
  department,
  workStream,
  name,
  publishingGroup,
  opportunityLength,
}: ClassificationFields): boolean {
  return !!(
    !areaOfSelection?.value ||
    !classification ||
    !department ||
    !workStream ||
    !name?.en ||
    !name?.fr ||
    !publishingGroup ||
    !opportunityLength
  );
}
