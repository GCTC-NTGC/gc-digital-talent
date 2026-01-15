import { ApplicationStatus } from "@gc-digital-talent/graphql";

const sortOrder = [
  ApplicationStatus.Qualified,
  ApplicationStatus.ToAssess,
  ApplicationStatus.Disqualified,
  ApplicationStatus.Removed,
  ApplicationStatus.Draft,
];

const sortStatus = (a?: ApplicationStatus, b?: ApplicationStatus) => {
  const aPosition = sortOrder.indexOf(
    a ?? ApplicationStatus.Draft, // if status undefined fallback to treating as last status in ordering
  );
  const bPosition = sortOrder.indexOf(b ?? ApplicationStatus.Draft);
  if (aPosition >= 0 && bPosition >= 0)
    return (
      sortOrder.indexOf(a ?? ApplicationStatus.Draft) -
      sortOrder.indexOf(b ?? ApplicationStatus.Draft)
    );
  if (aPosition >= 0 && bPosition < 0) return -1;
  if (aPosition < 0 && bPosition >= 0) return 1;
  return 0;
};

export default sortStatus;
