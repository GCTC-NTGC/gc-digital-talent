import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";

import Warning from "./Warning";

const UpdateLink = () => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <p className="mb-6">
      <Link
        color="secondary"
        mode="inline"
        newTab
        href={paths.careerTimeline()}
      >
        {intl.formatMessage({
          defaultMessage: "Update your current position",
          id: "pTXZxW",
          description: "Link text to page to update experiences",
        })}
      </Link>
    </p>
  );
};

const SubstantiveExperiences_Fragment = graphql(/** GraphQL */ `
  fragment SubstantiveExperiences on WorkExperience {
    id
    department {
      isCorePublicAdministration
    }
    ...ExperienceCard
  }
`);

interface SubstantiveExperiencesProps {
  query: FragmentType<typeof SubstantiveExperiences_Fragment>[];
}

const SubstantiveExperiences = ({ query }: SubstantiveExperiencesProps) => {
  const intl = useIntl();
  const substantiveExperiences = getFragment(
    SubstantiveExperiences_Fragment,
    query,
  );
  const experiences = unpackMaybes(substantiveExperiences);
  // Could be more, confirm at least one is CPA
  const isCPA = experiences
    .flatMap((exp) => !!exp.department?.isCorePublicAdministration)
    .reduce((acc, curr) => acc || curr, false);

  if (!experiences.length) {
    return (
      <>
        <Warning isError>
          <p>
            {intl.formatMessage({
              defaultMessage: "Missing a substantive position",
              id: "L+N6IY",
              description:
                "Title for when a user is missing a substantive experience",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Your current position is either missing, not marked as substantive or not marked as a Government of Canada experience.",
              id: "ZYdnjA",
              description:
                "Error message that appears when a user is missing a substantive experience",
            })}
          </p>
        </Warning>
        <UpdateLink />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-y-3">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experienceQuery={exp} showEdit={false} />
        ))}
        {!isCPA && (
          <Warning>
            <p>
              {intl.formatMessage({
                defaultMessage: "This position is not with a CPA department",
                id: "CYMMd0",
                description:
                  "Title for when the users substantive experience is not work a core public admin department",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This functionality is available only if your substantive position is with a department in the core public administration.",
                id: "9XY9Ok",
                description:
                  "Description that wfa is only available for core public admin departments",
              })}
            </p>
          </Warning>
        )}
      </div>
      <UpdateLink />
    </>
  );
};

export default SubstantiveExperiences;
