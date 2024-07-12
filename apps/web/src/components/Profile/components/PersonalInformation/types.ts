import {
  ArmedForcesStatus,
  CitizenshipStatus,
  Language,
  Maybe,
  ProvinceOrTerritory,
} from "@gc-digital-talent/graphql";

export type FormValues = {
  armedForcesStatus?: Maybe<ArmedForcesStatus>;
  citizenship?: Maybe<CitizenshipStatus>;
  preferredLang?: Maybe<Language>;
  preferredLanguageForInterview?: Maybe<Language>;
  preferredLanguageForExam?: Maybe<Language>;
  currentProvince?: Maybe<ProvinceOrTerritory>;
  currentCity?: Maybe<string>;
  telephone?: Maybe<string>;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  email?: Maybe<string>;
  isEmailVerified?: Maybe<boolean>;
};
