import * as React from "react";
import { useIntl } from "react-intl";
import UserProfile from "@common/components/UserProfile";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { commonMessages, navigationMessages } from "@common/messages";
import MissingSkills from "@common/components/skills/MissingSkills";
import { notEmpty } from "@common/helpers/util";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { Link } from "@common/components";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { flattenExperienceSkills } from "@common/types/ExperienceUtils";
import { getMissingSkills } from "@common/helpers/skillUtils";
import {
  Applicant,
  PoolAdvertisement,
  useGetReviewMyApplicationPageDataQuery,
} from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import ApplicationPageWrapper from "../ApplicationPageWrapper/ApplicationPageWrapper";
import getFullPoolAdvertisementTitle from "../pool/getFullPoolAdvertisementTitle";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

interface ReviewMyApplicationProps {
  applicant: Applicant;
  poolAdvertisement: PoolAdvertisement;
  applicationId: string;
  closingDate: Date;
}

export const ReviewMyApplication: React.FunctionComponent<
  ReviewMyApplicationProps
> = ({ applicant, poolAdvertisement, applicationId, closingDate }) => {
  const intl = useIntl();
  const directIntakePaths = useDirectIntakeRoutes();
  const applicantProfileRoutes = useApplicantProfileRoutes();
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
  const jobTitle = getFullPoolAdvertisementTitle(intl, poolAdvertisement);

  return (
    <ApplicationPageWrapper
      closingDate={closingDate}
      title={intl.formatMessage({
        id: "/ooPqb",
        defaultMessage: "My application profile",
        description: "Title for review application page.",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            id: "Uaew4x",
            defaultMessage: "My applications",
            description: "Breadcrumb for review application page.",
          }),
          href: directIntakePaths.allPools(),
        },
        {
          title: jobTitle,
          href: directIntakePaths.poolApply(poolAdvertisement.id),
        },
        {
          title: intl.formatMessage(navigationMessages.stepOne),
        },
      ]}
      navigation={{
        currentStep: 1,
        steps: [
          {
            path: directIntakePaths.reviewApplication(applicant.id),
            label: intl.formatMessage({
              id: "LUEVdb",
              defaultMessage: "Step 1: Review my profile",
              description: "Navigation step in sign and submit page.",
            }),
          },
          {
            path: directIntakePaths.signAndSubmit(applicant.id),
            label: intl.formatMessage({
              id: "LOh+c5",
              defaultMessage: "Step 2: Sign and submit",
              description: "Navigation step in sign and submit page.",
            }),
            disabled: !isApplicationComplete ?? false,
          },
        ],
      }}
      subtitle={jobTitle}
    >
      <UserProfile
        applicant={applicant}
        sections={{
          myStatus: { isVisible: false },
          hiringPools: { isVisible: false },
          about: {
            isVisible: true,
            editUrl: applicantProfileRoutes.aboutMe(
              applicant.id,
              applicationId,
            ),
          },
          language: {
            isVisible: true,
            editUrl: applicantProfileRoutes.languageInformation(
              applicant.id,
              applicationId,
            ),
          },
          government: {
            isVisible: true,
            editUrl: applicantProfileRoutes.governmentInformation(
              applicant.id,
              applicationId,
            ),
          },
          workLocation: {
            isVisible: true,
            editUrl: applicantProfileRoutes.workLocation(
              applicant.id,
              applicationId,
            ),
          },
          workPreferences: {
            isVisible: true,
            editUrl: applicantProfileRoutes.workPreferences(
              applicant.id,
              applicationId,
            ),
          },
          employmentEquity: {
            isVisible: true,
            editUrl: applicantProfileRoutes.diversityEquityInclusion(
              applicant.id,
              applicationId,
            ),
          },
          roleSalary: {
            isVisible: true,
            editUrl: applicantProfileRoutes.roleSalary(
              applicant.id,
              applicationId,
            ),
          },
          skillsExperience: {
            isVisible: true,
            editUrl: applicantProfileRoutes.skillsAndExperiences(
              applicant.id,
              applicationId,
            ),
            override: (
              <>
                <div
                  data-h2-background-color="base(dt-gray.light)"
                  data-h2-padding="base(x1)"
                  data-h2-radius="base(s)"
                  data-h2-margin="base(0, 0, x1, 0)"
                >
                  {missingSkills && (
                    <MissingSkills
                      addedSkills={
                        hasExperiences
                          ? flattenExperienceSkills(experiences)
                          : []
                      }
                      requiredSkills={missingSkills.requiredSkills}
                      optionalSkills={missingSkills.optionalSkills}
                    />
                  )}
                  {!hasExperiences && (
                    <div
                      data-h2-radius="base(s)"
                      data-h2-background-color="base(light.dt-gray)"
                      data-h2-padding="base(x1)"
                    >
                      <p data-h2-font-style="base(italic)">
                        {intl.formatMessage({
                          id: "XzUzZz",
                          defaultMessage:
                            "There are no experiences on your profile yet. You can add some using the preceding buttons.",
                          description:
                            "Message to user when no experiences have been attached to profile.",
                        })}
                      </p>
                    </div>
                  )}
                </div>
                {hasExperiences && (
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
                    data-h2-display="base(flex)"
                  >
                    {intl.formatMessage({
                      id: "EVGeHh",
                      defaultMessage: "Continue to step 2",
                      description:
                        "Button message on footer of review my application page.",
                    })}
                    <ArrowSmallRightIcon
                      style={{ width: "1rem", marginLeft: "0.5rem" }}
                    />
                  </Link>
                  <Link
                    href={directIntakePaths.applications(applicant.id)}
                    color="black"
                    mode="inline"
                    type="button"
                  >
                    {intl.formatMessage({
                      id: "zqIEuu",
                      defaultMessage: "Go back to my applications",
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
  const [{ data, fetching, error }] = useGetReviewMyApplicationPageDataQuery({
    variables: { id: poolCandidateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate && data?.poolCandidate?.poolAdvertisement?.id ? (
        <ReviewMyApplication
          poolAdvertisement={data.poolCandidate.poolAdvertisement}
          applicant={data.poolCandidate.user as Applicant}
          applicationId={data.poolCandidate.id}
          closingDate={data.poolCandidate.poolAdvertisement?.expiryDate}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              id: "jcl2s9",
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
