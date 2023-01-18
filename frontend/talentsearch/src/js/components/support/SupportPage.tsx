import React from "react";
import { useIntl } from "react-intl";
import imageUrl from "@common/helpers/imageUrl";

import Hero from "@common/components/Hero";
import useTheme from "@common/hooks/useTheme";

import SupportForm from "./SupportForm";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRoutes from "../../hooks/useRoutes";

const flourishTopLight = imageUrl(
  TALENTSEARCH_APP_DIR,
  "support_top_light.png",
);
const flourishTopDark = imageUrl(TALENTSEARCH_APP_DIR, "support_top_dark.png");

const getFlourishStyles = (isTop: boolean) => ({
  "data-h2-position": "base(absolute)",
  "data-h2-height": "base(100%)",
  "data-h2-location": isTop
    ? "base(0, 0, auto, auto)"
    : "base(auto, auto, 0, 0)",
});

export const SupportPage: React.FC = () => {
  const { mode } = useTheme();
  const intl = useIntl();
  const paths = useRoutes();
  const title = intl.formatMessage({
    defaultMessage: "Contact and support",
    id: "MZJYQd",
    description: "Page title for the Support page",
  });

  const crumbs = useBreadcrumbs([
    {
      label: title,
      url: paths.support(),
    },
  ]);

  return (
    <>
      <Hero
        imgPath={imageUrl(TALENTSEARCH_APP_DIR, "support_header.png")}
        title={title}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Get in touch with us to provide feedback or report a problem.",
          id: "axQDlj",
          description: "Subtitle for the Support page",
        })}
        crumbs={crumbs}
      />
      <div
        data-h2-position="base(relative)"
        data-h2-padding="base(x4, 0)"
        data-h2-background-color="base(black.03) base:dark(black.90)"
      >
        <img
          alt=""
          src={mode === "dark" ? flourishTopDark : flourishTopLight}
          {...getFlourishStyles(true)}
        />
        <div
          data-h2-position="base(relative)"
          data-h2-container="base(center, small, x1) p-tablet(center, small, x2)"
        >
          <div
            data-h2-padding="base(x2)"
            data-h2-radius="base(rounded)"
            data-h2-shadow="base(large)"
            data-h2-background-color="base(white)"
          >
            <SupportForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
