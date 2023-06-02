import React, { HTMLAttributes } from "react";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import HandThumbUpIcon from "@heroicons/react/24/outline/HandThumbUpIcon";

import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { IconType } from "@gc-digital-talent/ui";

import LanguageInformationSection from "~/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "~/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "~/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "~/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "~/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
import RoleSalarySection from "~/components/UserProfile/ProfileSections/RoleSalarySection";
import PrintExperienceByType from "~/components/UserProfile/PrintExperienceByType/PrintExperienceByType";
import AdminAboutUserSection from "~/components/AdminAboutUserSection/AdminAboutUserSection";
import { PoolCandidate } from "~/api/generated";

import { navigationMessages } from "@gc-digital-talent/i18n";
import PoolCandidateDetailsSection from "./PoolCandidateDetailsSection";

const HeadingWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>{children}</div>
  );
};

export interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  icon?: IconType;
}

const Heading = ({
  icon,
  children,
  as = "h2",
  ...rest
}: HeadingProps & HTMLAttributes<HTMLHeadingElement>) => {
  const El = as;
  const Icon = icon || null;

  return (
    <El
      data-h2-display="base(flex)"
      data-h2-font-weight="base(700)"
      data-h2-align-items="base(center)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-justify-content="base(start)"
      {...rest}
    >
      {Icon && <Icon className="heading-icon" />}
      <span>{children}</span>
    </El>
  );
};

export interface PoolCandidateDocumentProps {
  candidates: PoolCandidate[];
}

const PoolCandidateDocument = React.forwardRef<
  HTMLDivElement,
  PoolCandidateDocumentProps
>(({ candidates }, ref) => {
  const intl = useIntl();
  return (
    <div
      style={{
        display: "none",
      }}
    >
      {/* a bunch of styling to tweak components for printing */}
      <style type="text/css" media="print">{`
        html{font-size:75%; padding: 16px;}
        .page-wrapper {
          padding-bottom: 2rem;
          border-bottom: 2px dashed black;
        }
        .heading-icon {
          flex-shrink: 0;
          height: 1.5rem;
          width: 1.5rem;
          margin-right: 1rem;
        }
        .experience-category {
          margin-top: 4rem;
        }
        .experience-category >div >span,
        .experience-category >div >p {
          display: inline-block;
          font-size: 1.5rem;
        }
        .accordion-header {
          width: 100%;
          text-align: left;
          padding-bottom: 1rem;
          padding-top: 1rem;
          padding-right: 1.5rem;
          padding-left: 1rem;
          margin-top: 2rem;
        }
        .accordion-header-context {
          display: flex;
          flex-shrink: 0;
          flex: initial;
          max-width: 100%;
          align-items: center;
          flex-direction: row;
        }
        .accordion-header-context .icon {
          width: 1.5rem;
        }
        .Accordion__Chevron {
          display: none;
        }
      }
    `}</style>
      <div ref={ref}>
        <div className="print-container">
          {candidates &&
            candidates.map((candidate, index) => {
              return (
                <React.Fragment key={candidate.id}>
                  <div className="page-wrapper">
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading
                          icon={LightBulbIcon}
                          style={{ flex: "1 1 0%" }}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Pool Candidate Details",
                            id: "JIpjuA",
                            description:
                              "Title of the pool candidate details content section",
                          })}
                        </Heading>
                      </HeadingWrapper>
                      <PoolCandidateDetailsSection candidate={candidate} />
                    </div>
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading
                          icon={LightBulbIcon}
                          style={{ flex: "1 1 0%" }}
                        >
                          {intl.formatMessage(navigationMessages.myStatus)}
                        </Heading>
                      </HeadingWrapper>
                      <AdminAboutUserSection applicant={candidate.user} />
                    </div>
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading
                          icon={ChatBubbleLeftRightIcon}
                          style={{ flex: "1 1 0%" }}
                        >
                          {intl.formatMessage(
                            navigationMessages.languageInformation,
                          )}
                        </Heading>
                      </HeadingWrapper>
                      <LanguageInformationSection applicant={candidate.user} />
                    </div>
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading
                          icon={BuildingLibraryIcon}
                          style={{ flex: "1 1 0%" }}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Government Information",
                            id: "l1cou8",
                            description:
                              "Title of the Government Information content section",
                          })}
                        </Heading>
                      </HeadingWrapper>
                      <GovernmentInformationSection
                        applicant={candidate.user}
                      />
                    </div>
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading icon={MapPinIcon} style={{ flex: "1 1 0%" }}>
                          {intl.formatMessage({
                            defaultMessage: "Work Location",
                            id: "F9R74z",
                            description:
                              "Title of the Work Location content section",
                          })}
                        </Heading>
                      </HeadingWrapper>
                      <WorkLocationSection applicant={candidate.user} />
                    </div>
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading
                          icon={HandThumbUpIcon}
                          style={{ flex: "1 1 0%" }}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Work Preferences",
                            id: "V89Ryn",
                            description:
                              "Title of the Work Preferences content section",
                          })}
                        </Heading>
                      </HeadingWrapper>
                      <WorkPreferencesSection applicant={candidate.user} />
                    </div>
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading
                          icon={InformationCircleIcon}
                          style={{ flex: "1 1 0%" }}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Employment Equity Information",
                            id: "aa7B7S",
                            description:
                              "Title of the Employment Equity Information content section",
                          })}
                        </Heading>
                      </HeadingWrapper>
                      <DiversityEquityInclusionSection
                        applicant={candidate.user}
                      />
                    </div>
                    <div className="page-section">
                      <HeadingWrapper>
                        <Heading
                          icon={CurrencyDollarIcon}
                          style={{ flex: "1 1 0%" }}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Role and salary expectations",
                            id: "uMzeiF",
                            description:
                              "Title of the Role and salary expectations section",
                          })}
                        </Heading>
                      </HeadingWrapper>
                      <RoleSalarySection applicant={candidate.user} />
                    </div>
                    <HeadingWrapper>
                      <Heading icon={BoltIcon} style={{ flex: "1 1 0%" }}>
                        {intl.formatMessage({
                          defaultMessage: "My skills and experience",
                          id: "Eui2Wf",
                          description:
                            "Title of the My skills and experience content section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <PrintExperienceByType
                      experiences={candidate.user.experiences?.filter(notEmpty)}
                    />
                  </div>
                  {index + 1 !== candidates.length && (
                    <div style={{ breakAfter: "page" }} />
                  )}
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
});

export default PoolCandidateDocument;
