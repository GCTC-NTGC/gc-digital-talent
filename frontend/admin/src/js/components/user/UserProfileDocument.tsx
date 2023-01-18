import React, { HTMLAttributes } from "react";
import {
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  BuildingLibraryIcon,
  LightBulbIcon,
  BoltIcon,
  MapPinIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "@common/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "@common/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "@common/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "@common/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
import RoleSalarySection from "@common/components/UserProfile/ProfileSections/RoleSalarySection";
import { notEmpty } from "@common/helpers/util";
import PrintExperienceByType from "@common/components/UserProfile/PrintExperienceByType/PrintExperienceByType";
import { Applicant } from "../../api/generated";
import AdminAboutSection from "./AdminAboutSection";

const HeadingWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>{children}</div>
  );
};

export interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  icon?: React.FC<{ className: string }>;
}

const Heading: React.FC<HeadingProps & HTMLAttributes<HTMLHeadingElement>> = ({
  icon,
  children,
  as = "h2",
  ...rest
}) => {
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

export interface UserProfileDocumentProps {
  applicants: Applicant[];
}

export const UserProfileDocument = React.forwardRef<
  HTMLDivElement,
  UserProfileDocumentProps
>(({ applicants }, ref) => {
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
          {applicants &&
            applicants.map((applicant) => {
              return (
                <div key={applicant.id} className="page-wrapper">
                  <div className="page-section">
                    <HeadingWrapper>
                      <Heading icon={LightBulbIcon} style={{ flex: "1 1 0%" }}>
                        {intl.formatMessage({
                          defaultMessage: "My Status",
                          id: "Cx3s+E",
                          description: "Title of the my status content section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <AdminAboutSection applicant={applicant} />
                  </div>
                  <div className="page-section">
                    <HeadingWrapper>
                      <Heading
                        icon={ChatBubbleLeftRightIcon}
                        style={{ flex: "1 1 0%" }}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Language Information",
                          id: "1pk/7X",
                          description:
                            "Title of the Language Information content section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <LanguageInformationSection applicant={applicant} />
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
                    <GovernmentInformationSection applicant={applicant} />
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
                    <WorkLocationSection applicant={applicant} />
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
                    <WorkPreferencesSection applicant={applicant} />
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
                    <DiversityEquityInclusionSection applicant={applicant} />
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
                    <RoleSalarySection applicant={applicant} />
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
                    experiences={applicant.experiences?.filter(notEmpty)}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
});

export default UserProfileDocument;
