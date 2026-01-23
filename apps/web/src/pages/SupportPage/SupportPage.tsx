import { useIntl } from "react-intl";

import { useTheme } from "@gc-digital-talent/theme";
import { Card, Container } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import flourishTopLight from "~/assets/img/support_top_light.webp";
import flourishTopDark from "~/assets/img/support_top_dark.webp";
import supportHeroImg from "~/assets/img/woman-on-cellphone-typing-on-laptop.webp";

import SupportForm from "./components/SupportForm/SupportForm";

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
      <div className="relative py-18">
        <img
          alt=""
          src={mode === "dark" ? flourishTopDark : flourishTopLight}
          className="absolute top-0 right-0 h-full"
        />
        <Container size="sm" className="relative">
          <Card className="p-12">
            <SupportForm />
          </Card>
        </Container>
      </div>
    </>
  );
};

Component.displayName = "SupportPage";

export default Component;
