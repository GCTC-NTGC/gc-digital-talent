import * as React from "react";
import { Button } from "@common/components/Button";
import { Breadcrumbs, BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { SaveIcon, UserIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
import { Link } from "@common/components";
import { imageUrl } from "@common/helpers/router";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

export interface ProfileFormWrapperProps {
  bottomButton?: "cancel" | "save" | "both";
  crumbs: BreadcrumbsProps["links"];
  description: string;
  title: string;
  handleSave: () => void;
}

const ProfileFormWrapper: React.FunctionComponent<ProfileFormWrapperProps> = ({
  bottomButton = "cancel",
  crumbs,
  description,
  title,
  handleSave,
  children,
}) => {
  const intl = useIntl();
  const links = [
    {
      title: "My Profile",
      href: "/", // TODO: Replace with profile link when created
      icon: <UserIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    ...crumbs,
  ];

  const cancelButton = (
    <Link
      href="/"
      title={intl.formatMessage({
        defaultMessage: "Cancel and go back",
        description: "Title for cancel link in applicant profile forms.",
      })}
    >
      <Button
        color="secondary"
        mode="outline"
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
      >
        <ArrowCircleLeftIcon style={{ width: "1rem" }} />
        <span data-h2-margin="b(left, xxs)">
          {intl.formatMessage({
            defaultMessage: "Cancel and go back",
            description: "Label for cancel button on profile form.",
          })}
        </span>
      </Button>
    </Link>
  );

  const saveButton = (
    <Button
      color="cta"
      mode="solid"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      onClick={handleSave}
    >
      <SaveIcon style={{ width: "1rem" }} />
      <span data-h2-margin="b(right, xxs)">
        {intl.formatMessage({
          defaultMessage: "Save and go back",
          description: "Label for save button on profile form.",
        })}
      </span>
    </Button>
  );

  const bottomButtons = () => {
    switch (bottomButton) {
      case "both":
        return (
          <>
            <span data-h2-padding="b(right, xs)">{cancelButton}</span>
            <span>{saveButton}</span>
          </>
        );
      case "cancel":
        return cancelButton;
      case "save":
        return saveButton;
      default:
        return null;
    }
  };

  const breadcrumbs = (
    <div
      data-h2-padding="b(top-bottom, m) b(right-left, l) s(right-left, xxl)"
      data-h2-font-color="b(white)"
      style={{
        background: `url(${imageUrl(
          TALENTSEARCH_APP_DIR,
          "applicant-profile-banner.jpg",
        )})`,
        backgroundSize: "100vw 5rem",
      }}
    >
      <Breadcrumbs links={links} />
    </div>
  );

  return (
    <section>
      {breadcrumbs}
      <div data-h2-margin="b(right-left, l) s(right-left, xxl)">
        <div data-h2-margin="b(top-bottom, l)">{cancelButton}</div>
        <h1
          data-h2-margin="b(all, none)"
          data-h2-font-size="b(h2)"
          data-h2-font-weight="b(100)"
        >
          {title}
        </h1>
        <p>{description}</p>
        <div>{children}</div>
        <div data-h2-margin="b(top-bottom, l)" data-h2-display="b(flex)">
          {bottomButtons()}
        </div>
      </div>
      {breadcrumbs}
    </section>
  );
};

export default ProfileFormWrapper;
