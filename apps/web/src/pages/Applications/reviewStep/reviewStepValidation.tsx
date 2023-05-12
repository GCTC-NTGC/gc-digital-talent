import {
  Applicant,
  PoolAdvertisement,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

const stepHasError = (
  _applicant: Applicant,
  _poolAdvertisement: PoolAdvertisement,
  application: Omit<PoolCandidate, "pool">,
) => {
  return !application.signature;
};

export default stepHasError;
