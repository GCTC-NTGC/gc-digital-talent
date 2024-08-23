import { useIntl } from "react-intl";

import { useTheme } from "@gc-digital-talent/theme";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import flourishTopLight from "~/assets/img/support_top_light.webp";
import flourishTopDark from "~/assets/img/support_top_dark.webp";
import supportHeroImg from "~/assets/img/support_header.webp";

import SupportForm from "./components/SupportForm/SupportForm";

const getFlourishStyles = (isTop: boolean) => ({
  "data-h2-position": "base(absolute)",
  "data-h2-height": "base(100%)",
  "data-h2-location": isTop
    ? "base(0, 0, auto, auto)"
    : "base(auto, auto, 0, 0)",
});

export const Component = () => {
  const { mode } = useTheme();
  const intl = useIntl();
  const paths = useRoutes();
  const title = intl.formatMessage({
    defaultMessage: "Contact and support",
    id: "MZJYQd",
    description: "Page title for the Support page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: title,
        url: paths.support(),
      },
    ],
  });

  return (
    <>
      <Hero
        imgPath={supportHeroImg}
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
        data-h2-padding="base(x3, 0)"
        data-h2-background-color="base(background)"
      >
        <img
          alt=""
          src={mode === "dark" ? flourishTopDark : flourishTopLight}
          {...getFlourishStyles(true)}
        />
        <div
          data-h2-position="base(relative)"
          data-h2-wrapper="base(center, small, x1) p-tablet(center, small, x2)"
        >
          <div
            data-h2-padding="base(x2)"
            data-h2-radius="base(rounded)"
            data-h2-shadow="base(large)"
            data-h2-background-color="base(foreground)"
          >
            <SupportForm />
          </div>
        </div>
      </div>
    </>
  );
};

Component.displayName = "SupportPage";

export default Component;
