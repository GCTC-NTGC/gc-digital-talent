import React from "react";
import TableOfContents from "@common/components/TableOfContents";
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
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { notEmpty } from "@common/helpers/util";
import { Applicant } from "../../api/generated";
import AdminAboutSection from "./AdminAboutSection";

const HeadingWrapper: React.FC = ({ children }) => {
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>{children}</div>
  );
};

export interface UserProfileDocumentProps {
  applicant: Applicant;
}

export const UserProfileDocument = React.forwardRef<
  HTMLDivElement,
  UserProfileDocumentProps
>(({ applicant }, ref) => {
  const intl = useIntl();
  return (
    <div
      style={{
        display: "none",
      }}
    >
      <div ref={ref}>
        <div className="print-container">
          {/* My Status */}
          <HeadingWrapper>
            <TableOfContents.Heading
              icon={LightBulbIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "My Status",
                description: "Title of the my status content section",
              })}
            </TableOfContents.Heading>
          </HeadingWrapper>
          <AdminAboutSection applicant={applicant} />

          {/* Language Information */}
          <HeadingWrapper>
            <TableOfContents.Heading
              icon={ChatAlt2Icon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Language Information",
                description:
                  "Title of the Language Information content section",
              })}
            </TableOfContents.Heading>
          </HeadingWrapper>
          <LanguageInformationSection applicant={applicant} />

          {/* Government */}
          <TableOfContents.Section id="government-section">
            <HeadingWrapper>
              <TableOfContents.Heading
                icon={LibraryIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Government Information",
                  description:
                    "Title of the Government Information content section",
                })}
              </TableOfContents.Heading>
            </HeadingWrapper>
            <GovernmentInformationSection applicant={applicant} />
          </TableOfContents.Section>

          {/* Work Location */}
          <HeadingWrapper>
            <TableOfContents.Heading
              icon={LocationMarkerIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Work Location",
                description: "Title of the Work Location content section",
              })}
            </TableOfContents.Heading>
          </HeadingWrapper>
          <WorkLocationSection applicant={applicant} />

          {/* Work Preferences */}
          <HeadingWrapper>
            <TableOfContents.Heading
              icon={ThumbUpIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Work Preferences",
                description: "Title of the Work Preferences content section",
              })}
            </TableOfContents.Heading>
          </HeadingWrapper>
          <WorkPreferencesSection applicant={applicant} />

          {/* Employment Equite */}
          <HeadingWrapper>
            <TableOfContents.Heading
              icon={InformationCircleIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Employment Equity Information",
                description:
                  "Title of the Employment Equity Information content section",
              })}
            </TableOfContents.Heading>
          </HeadingWrapper>
          <DiversityEquityInclusionSection applicant={applicant} />

          {/* Role Salary */}
          <HeadingWrapper>
            <TableOfContents.Heading
              icon={CurrencyDollarIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Role and salary expectations",
                description:
                  "Title of the Role and salary expectations section",
              })}
            </TableOfContents.Heading>
          </HeadingWrapper>
          <RoleSalarySection applicant={applicant} />

          {/* Skills Experience */}
          <HeadingWrapper>
            <TableOfContents.Heading
              icon={LightningBoltIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "My skills and experience",
                description:
                  "Title of the My skills and experience content section",
              })}
            </TableOfContents.Heading>
          </HeadingWrapper>
          <ExperienceSection
            experiences={applicant.experiences?.filter(notEmpty)}
          />
        </div>
      </div>
    </div>
  );
});

export default UserProfileDocument;
