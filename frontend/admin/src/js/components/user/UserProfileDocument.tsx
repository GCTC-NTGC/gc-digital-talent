import React, { HTMLAttributes } from "react";
import {
  ChatAlt2Icon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  LibraryIcon,
  LightBulbIcon,
  LightningBoltIcon,
  LocationMarkerIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";
import { useIntl } from "react-intl";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "@common/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "@common/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "@common/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "@common/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
import RoleSalarySection from "@common/components/UserProfile/ProfileSections/RoleSalarySection";
import { notEmpty } from "@common/helpers/util";
import ExperienceByTypeListing from "@common/components/UserProfile/ExperienceByTypeListing";
import { Applicant } from "../../api/generated";
import AdminAboutSection from "./AdminAboutSection";

const HeadingWrapper: React.FC = ({ children }) => {
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
      data-h2-display="b(flex)"
      data-h2-font-weight="b(800)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(top, none) b(bottom, m)"
      data-h2-justify-content="b(start)"
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
        .heading-icon {
          flex-shrink: 0;
          height: 1.5rem;
          width: 1.5rem;
          margin-right: 1rem;
        }
        .accordion-header {
          width: 100%;
          text-align: left;
          padding-bottom: 1rem;
          padding-top: 1rem;
          padding-right: 1.5rem;
          padding-left: 1rem;
        }
        .accordion-header-context {
          display: flex;
          flex-shrink: 0;
          flex: initial;
          max-width: 100%;
          align-items: center;
          flex-direction: row;
        }
      }
    `}</style>
      <div ref={ref}>
        <div className="print-container">
          {applicants &&
            applicants.map((applicant) => {
              return (
                <div key={applicant.id}>
                  <div className="page-section">
                    <HeadingWrapper>
                      <Heading icon={LightBulbIcon} style={{ flex: "1 1 0%" }}>
                        {intl.formatMessage({
                          defaultMessage: "My Status",
                          description: "Title of the my status content section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <AdminAboutSection applicant={applicant} />
                  </div>
                  <div className="page-section">
                    <HeadingWrapper>
                      <Heading icon={ChatAlt2Icon} style={{ flex: "1 1 0%" }}>
                        {intl.formatMessage({
                          defaultMessage: "Language Information",
                          description:
                            "Title of the Language Information content section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <LanguageInformationSection applicant={applicant} />
                  </div>
                  <div className="page-section">
                    <HeadingWrapper>
                      <Heading icon={LibraryIcon} style={{ flex: "1 1 0%" }}>
                        {intl.formatMessage({
                          defaultMessage: "Government Information",
                          description:
                            "Title of the Government Information content section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <GovernmentInformationSection applicant={applicant} />
                  </div>
                  <div className="page-section">
                    <HeadingWrapper>
                      <Heading
                        icon={LocationMarkerIcon}
                        style={{ flex: "1 1 0%" }}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Work Location",
                          description:
                            "Title of the Work Location content section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <WorkLocationSection applicant={applicant} />
                  </div>
                  <div className="page-section">
                    <HeadingWrapper>
                      <Heading icon={ThumbUpIcon} style={{ flex: "1 1 0%" }}>
                        {intl.formatMessage({
                          defaultMessage: "Work Preferences",
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
                          description:
                            "Title of the Role and salary expectations section",
                        })}
                      </Heading>
                    </HeadingWrapper>
                    <RoleSalarySection applicant={applicant} />
                  </div>
                  <HeadingWrapper>
                    <Heading
                      icon={LightningBoltIcon}
                      style={{ flex: "1 1 0%" }}
                    >
                      {intl.formatMessage({
                        defaultMessage: "My skills and experience",
                        description:
                          "Title of the My skills and experience content section",
                      })}
                    </Heading>
                  </HeadingWrapper>
                  <ExperienceByTypeListing
                    experiences={applicant.experiences?.filter(notEmpty)}
                    defaultOpen
                  />
                </div>
              );
            })}
          ;
        </div>
      </div>
    </div>
  );
});

export default UserProfileDocument;
