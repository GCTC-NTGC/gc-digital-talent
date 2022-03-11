import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import { Experience } from "../../api/generated";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileFormWrapper from "./ProfileFormWrapper";

const ExperienceAndSkillsPage: React.FunctionComponent<{
  experiences: Experience[];
}> = ({ experiences }) => {
  const intl = useIntl();
  const links = [
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Personal",
        description: "Title for personal experience form button.",
      }),
      icon: <LightBulbIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Community",
        description: "Title for community experience form button.",
      }),
      icon: <UserGroupIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Work",
        description: "Title for work experience form button.",
      }),
      icon: <BriefcaseIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Education",
        description: "Title for education experience form button.",
      }),
      icon: <BookOpenIcon style={{ width: "1rem" }} />,
    },
    {
      href: "/",
      title: intl.formatMessage({
        defaultMessage: "Award",
        description: "Title for award experience form button.",
      }),
      icon: <StarIcon style={{ width: "1rem" }} />,
    },
  ];

  return (
    <ProfileFormWrapper
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Experience and Skills",
            description:
              "Breadcrumb for experience and skills page in applicant profile.",
          }),
        },
      ]}
      description={intl.formatMessage({
        defaultMessage:
          "Here is where you can add experiences and skills to your profile. This could be anything from helping community members troubleshoot their computers to full-time employment at an IT organization.",
        description:
          "Description for the experience and skills page in applicant profile.",
      })}
      title={intl.formatMessage({
        defaultMessage: "Experience and Skills",
        description:
          "Heading for experience and skills page in applicant profile.",
      })}
    >
      <div data-h2-display="b(flex)" data-h2-align-items="b(center)">
        <p
          data-h2-font-style="b(reset)"
          data-h2-font-weight="b(700)"
          style={{ textTransform: "uppercase" }}
        >
          {intl.formatMessage({
            defaultMessage: "Add new experience:",
            description:
              "Label before new experience buttons on experience and skills page.",
          })}
        </p>
        <div
          data-h2-margin="b(all, m)"
          data-h2-padding="b(all, m)"
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between)"
          data-h2-radius="b(s)"
          data-h2-bg-color="b(lightgray)"
          style={{ flexGrow: "2" }}
        >
          {links.map(({ title, href, icon }) => (
            <a key={title} href={href} title={title}>
              {icon}
              <span data-h2-padding="b(all, xs)">{title}</span>
            </a>
          ))}
        </div>
      </div>
      <div
        data-h2-radius="b(s)"
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(all, m)"
      >
        {experiences.length > 0 ? (
          experiences.map(() => <div>Experince Accordion</div>)
        ) : (
          <p data-h2-font-style="b(italic)">
            {intl.formatMessage({
              defaultMessage:
                "There are no experiences on your profile yet. You can add some using the links above.",
              description:
                "Message to user when no experiences have been attached to profile.",
            })}
          </p>
        )}
      </div>
      <ProfileFormFooter mode="cancelButton" />
    </ProfileFormWrapper>
  );
};

export default ExperienceAndSkillsPage;
