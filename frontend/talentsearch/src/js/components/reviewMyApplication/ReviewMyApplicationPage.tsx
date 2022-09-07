import * as React from "react";
import { useIntl } from "react-intl";
import UserProfile from "@common/components/UserProfile";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { commonMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";
import MissingSkills from "@common/components/skills/MissingSkills";
import { notEmpty } from "@common/helpers/util";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { Link } from "@common/components";
import { getMissingSkills } from "@common/components/skills/MissingSkills/MissingSkills";
import {
  Applicant,
  Maybe,
  PoolAdvertisement,
  useGetReviewMyApplicationPageDataQuery,
} from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import ApplicationPageWrapper from "../ApplicationPageWrapper/ApplicationPageWrapper";
import { flattenExperienceSkills } from "../experienceAndSkills/ExperienceAndSkills";

interface ReviewMyApplicationProps {
  applicant: Applicant;
  poolAdvertisement: PoolAdvertisement;
  poolCandidateId: string;
  closingDate: Date;
  jobTitle: Maybe<string>;
  poolId: string;
}

export const ReviewMyApplication: React.FunctionComponent<
  ReviewMyApplicationProps
> = ({
  applicant,
  poolAdvertisement,
  poolCandidateId,
  closingDate,
  jobTitle,
  poolId,
}) => {
  const intl = useIntl();
  const directIntakePaths = useDirectIntakeRoutes();
  const experiences = applicant.experiences?.filter(notEmpty) || [];
  const missingSkills = {
    requiredSkills: poolAdvertisement.essentialSkills?.filter(notEmpty),
    optionalSkills: poolAdvertisement.nonessentialSkills?.filter(notEmpty),
  };
  const hasExperiences = notEmpty(applicant.experiences);
  const { isProfileComplete } = applicant;
  const isApplicationComplete =
    isProfileComplete === true &&
    getMissingSkills(
      missingSkills.requiredSkills || [],
      hasExperiences ? flattenExperienceSkills(experiences) : [],
    ).length === 0;

  return (
    <ApplicationPageWrapper
      closingDate={closingDate}
      title={intl.formatMessage({
        defaultMessage: "My application profile",
        description: "Title for review application page.",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "My applications",
            description: "Breadcrumb for review application page.",
          }),
          href: directIntakePaths.allPools(),
        },
        {
          title:
            jobTitle || intl.formatMessage(commonMessages.jobTitleNotFound),
          href: directIntakePaths.poolApply(poolId),
        },
        {
          title: intl.formatMessage({
            defaultMessage: "Step 1",
            description: "Breadcrumb for review application page.",
          }),
        },
      ]}
      navigation={{
        currentStep: 1,
        steps: [
          {
            path: directIntakePaths.reviewApplication(applicant.id),
            label: intl.formatMessage({
              defaultMessage: "Step 1: Review my profile",
              description: "Navigation step in sign and submit page.",
            }),
          },
          {
            path: directIntakePaths.signAndSubmit(applicant.id),
            label: intl.formatMessage({
              defaultMessage: "Step 2: Sign and submit",
              description: "Navigation step in sign and submit page.",
            }),
            disabled: !isApplicationComplete ?? false,
          },
        ],
      }}
      subtitle={jobTitle || intl.formatMessage(commonMessages.jobTitleNotFound)}
    >
      <UserProfile
        applicant={applicant}
        sections={{
          myStatus: { isVisible: false },
          hiringPools: { isVisible: false },
          about: {
            isVisible: true,
            editUrl: `${directIntakePaths.aboutMe(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
          },
          language: {
            isVisible: true,
            editUrl: `${directIntakePaths.languageInformation(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
          },
          government: {
            isVisible: true,
            editUrl: `${directIntakePaths.governmentInformation(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
          },
          workLocation: {
            isVisible: true,
            editUrl: `${directIntakePaths.workLocation(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
          },
          workPreferences: {
            isVisible: true,
            editUrl: `${directIntakePaths.workPreferences(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
          },
          employmentEquity: {
            isVisible: true,
            editUrl: `${directIntakePaths.diversityEquityInclusion(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
          },
          roleSalary: {
            isVisible: true,
            editUrl: `${directIntakePaths.roleSalary(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
          },
          skillsExperience: {
            isVisible: true,
            editUrl: `${directIntakePaths.skillsAndExperiences(
              poolCandidateId,
            )}?application=${poolCandidateId}`,
            override: (
              <>
                {missingSkills && (
                  <div data-h2-margin="base(x1, 0)">
                    <MissingSkills
                      addedSkills={
                        hasExperiences
                          ? flattenExperienceSkills(experiences)
                          : []
                      }
                      requiredSkills={missingSkills.requiredSkills}
                      optionalSkills={missingSkills.optionalSkills}
                    />
                  </div>
                )}
                {!hasExperiences ? (
                  <div
                    data-h2-radius="base(s)"
                    data-h2-background-color="base(light.dt-gray)"
                    data-h2-padding="base(x1)"
                  >
                    <p data-h2-font-style="base(italic)">
                      {intl.formatMessage({
                        defaultMessage:
                          "There are no experiences on your profile yet. You can add some using the preceding buttons.",
                        description:
                          "Message to user when no experiences have been attached to profile.",
                      })}
                    </p>
                  </div>
                ) : (
                  <ExperienceSection experiences={experiences} />
                )}
                <div
                  data-h2-display="base(flex)"
                  data-h2-padding="base(x2, 0, 0, 0)"
                  style={{ gap: "1rem" }}
                >
                  <Link
                    href={directIntakePaths.signAndSubmit(applicant.id)}
                    color="cta"
                    mode="solid"
                    type="button"
                    disabled={!isApplicationComplete ?? false}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Continue to step 2",
                      description:
                        "Button message on footer of review my application page.",
                    })}
                  </Link>
                  <Link
                    href={directIntakePaths.applications(applicant.id)}
                    color="black"
                    mode="inline"
                    type="button"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Save and go back to my applications",
                      description:
                        "Button message on footer of review my application page.",
                    })}
                  </Link>
                </div>
              </>
            ),
          },
        }}
      />
    </ApplicationPageWrapper>
  );
};

const ReviewMyApplicationPage: React.FC<{ poolCandidateId: string }> = ({
  poolCandidateId,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const [{ data, fetching, error }] = useGetReviewMyApplicationPageDataQuery({
    variables: { id: poolCandidateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate && data?.poolCandidate?.poolAdvertisement?.id ? (
        <ReviewMyApplication
          poolAdvertisement={data.poolCandidate.poolAdvertisement}
          applicant={data.poolCandidate.user as Applicant}
          poolCandidateId={data.poolCandidate.id}
          closingDate={data.poolCandidate.poolAdvertisement?.expiryDate}
          jobTitle={data.poolCandidate?.poolAdvertisement?.name?.[locale]}
          poolId={data.poolCandidate.poolAdvertisement?.id}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Error, pool candidate unable to be loaded",
              description: "Error message, placeholder",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ReviewMyApplicationPage;
