import { useIntl } from "react-intl";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";

import { CardBasic, Heading, Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import managers from "~/assets/img/Managers_image.webp";
import hr from "~/assets/img/Human_resources_image.webp";
import procurement from "~/assets/img/Procurement_officer_image.webp";

const Resources = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return (
    <>
      <section>
        <Heading
          Icon={FolderOpenIcon}
          size="h3"
          color="warning"
          data-h2-margin="base(x3, 0, x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Resources",
            id: "Kwfc/6",
            description:
              "Heading for section for the group-specific resources section.",
          })}
        </Heading>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
          data-h2-gap="base(x1)"
          data-h2-margin="base(x1, 0, 0, 0) p-tablet(x2, 0, 0, 0)"
        >
          <CardBasic
            data-h2-overflow="base(hidden)"
            data-h2-padding="base(0)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <div
              data-h2-display="base(block) base:children[>span](block)"
              data-h2-padding="base(x1)"
              data-h2-background-color="base(gray.darkest) base:dark(foreground.shade)"
              data-h2-color="base:all(white)"
            >
              <span data-h2-font-size="base(h6, 1)">
                {intl.formatMessage({
                  defaultMessage: "Digital initiative managers",
                  id: "Tvsi5A",
                  description: "Title for group-specific resource card",
                })}
              </span>
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-justify-content="base(space-between)"
              data-h2-flex-grow="base(1)"
            >
              <div>
                <img
                  src={managers}
                  alt=""
                  data-h2-display="base(none) p-tablet(block)"
                />

                <p data-h2-padding="base(0 x1)">
                  {intl.formatMessage({
                    defaultMessage:
                      "This implementation guidance is designed to support digital initiative managers and leads in fulfilling their responsibilities under the <cite>Directive on Digital Talent</cite>. It explains why the directive is needed and what is required.",
                    id: "vYi5/y",
                    description:
                      "Body message for digital initiative managers section.",
                  })}
                </p>
              </div>
              <div data-h2-padding="base(x1)">
                <Link
                  mode="text"
                  data-h2-font-weight="base(bold)"
                  color="secondary"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Manager_text_EN.docx"
                      : "/static/documents/Orientation_gestionnaire_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for managers",
                    id: "yNPkM8",
                    description:
                      "Aria label for download guidance for managers plain text link.",
                  })}
                </Link>
              </div>
            </div>
          </CardBasic>
          <CardBasic
            data-h2-overflow="base(hidden)"
            data-h2-padding="base(0)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <div
              data-h2-display="base(block) base:children[>span](block)"
              data-h2-padding="base(x1)"
              data-h2-background-color="base(gray.darkest) base:dark(foreground.shade)"
              data-h2-color="base:all(white)"
            >
              <span data-h2-font-size="base(h6, 1)">
                {intl.formatMessage({
                  defaultMessage: "Human resources advisors",
                  id: "x+kUrO",
                  description: "Title for group-specific resource card",
                })}
              </span>
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-justify-content="base(space-between)"
              data-h2-flex-grow="base(1)"
            >
              <div>
                <img
                  src={hr}
                  alt=""
                  data-h2-display="base(none) p-tablet(block)"
                />
                <p data-h2-padding="base(0 x1)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Human resources (HR) advisors are responsible for ensuring clients looking for digital talent are aware of their obligations under the <cite>Directive on Digital Talent</cite> and supporting clients in leveraging flexibilities available in the HR policy suite to hire digital talent. This implementation guidance is designed to help HR advisors in carrying out these responsibilities.",
                    id: "Msshus",
                    description:
                      "Body message for digital initiative human resources section.",
                  })}
                </p>
              </div>
              <div data-h2-padding="base(x1)">
                <Link
                  mode="text"
                  data-h2-font-weight="base(bold)"
                  color="secondary"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_HR_text_EN.docx"
                      : "/static/documents/Orientation_RH_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for HR advisors",
                    id: "xV43au",
                    description:
                      "Aria label for download guidance for human resources plain text link.",
                  })}
                </Link>
              </div>
            </div>
          </CardBasic>
          <CardBasic
            data-h2-overflow="base(hidden)"
            data-h2-padding="base(0)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <div
              data-h2-display="base(block) base:children[>span](block)"
              data-h2-padding="base(x1)"
              data-h2-background-color="base(gray.darkest) base:dark(foreground.shade)"
              data-h2-color="base:all(white)"
            >
              <span data-h2-font-size="base(h6, 1)">
                {intl.formatMessage({
                  defaultMessage: "Procurement officers",
                  id: "n92mcX",
                  description: "Title for procurement officer resource card",
                })}
              </span>
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-justify-content="base(space-between)"
              data-h2-flex-grow="base(1)"
            >
              <div>
                <img
                  src={procurement}
                  alt=""
                  data-h2-display="base(none) p-tablet(block)"
                />
                <p data-h2-margin="base(x1)">
                  {intl.formatMessage({
                    defaultMessage:
                      "The Directive does not introduce any additional procedural steps for procurement officers, but there are procurement-related reporting requirements that fall to business owners. This resource is designed to help procurement officers in supporting their clients when they procure digital services (e.g. digital talent, IT-related, IM-related, etc.).",
                    id: "+76ObM",
                    description:
                      "Body message for digital initiative procurement section.",
                  })}
                </p>
              </div>
              <div data-h2-padding="base(x1)">
                <Link
                  mode="text"
                  data-h2-font-weight="base(bold)"
                  color="secondary"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Procurement_text_EN.docx"
                      : "/static/documents/Orientation_approvisionnement_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for procurement officers",
                    id: "7JQCZ0",
                    description:
                      "Aria label for download guidance for procurement officers plain text link.",
                  })}
                </Link>
              </div>
            </div>
          </CardBasic>
        </div>
      </section>
    </>
  );
};

export default Resources;
