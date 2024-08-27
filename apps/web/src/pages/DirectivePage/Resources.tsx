import { useIntl } from "react-intl";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/outline/ArrowDownOnSquareIcon";

import { CardBasic, Heading, Link } from "@gc-digital-talent/ui";
import { uiMessages, getLocale } from "@gc-digital-talent/i18n";

import decisionTree from "~/assets/img/Directive_landing_page_graphics_R1-02.webp";
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
          Icon={ClipboardDocumentIcon}
          size="h3"
          color="secondary"
          data-h2-margin="base(x3, 0, x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "General resources",
            id: "MZHzIW",
            description:
              "Heading for section for the general resources section.",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "These resources provide a general overall of the requirements under the Directive on Digital Talent. The training session presentation and the reporting requirements decision tree contain information applicable to all user groups.",
            id: "BRpssM",
            description: "First message for the general resources section.",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Resources tailored for specific user groups can be found under group-specific resources.",
            id: "C+7Yb0",
            description: "Second message for the general resources section.",
          })}
        </p>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
          data-h2-gap="base(x1) p-tablet(x2)"
          data-h2-margin="base(x1, 0, 0, 0) p-tablet(x2, 0, 0, 0)"
        >
          <CardBasic
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-justify-content="base(space-evenly)"
          >
            <img
              src={decisionTree}
              alt=""
              data-h2-display="base(none) p-tablet(block)"
              data-h2-margin="base(0, 0, x1, 0)"
            />
            <Link
              mode="solid"
              color="secondary"
              block
              external
              download
              href={
                locale === "en"
                  ? "/static/documents/Decision_Tree_PDF_EN.pdf"
                  : "/static/documents/Arbre_decisionnel_PDF_FR.pdf"
              }
              data-h2-margin="base(0, 0, x1, 0)"
            >
              {intl.formatMessage({
                defaultMessage:
                  "Download the reporting requirements decision tree (PDF)",
                id: "nrJ4qt",
                description:
                  "Button text to download reporting requirements decision tree pdf.",
              })}
            </Link>
            <Link
              mode="inline"
              color="secondary"
              block
              external
              download
              href={
                locale === "en"
                  ? "/static/documents/Decision_Tree_Text_EN.docx"
                  : "/static/documents/Arbre_decisionnel_texte_FR.docx"
              }
            >
              {intl.formatMessage({
                defaultMessage:
                  "Download the reporting requirements decision tree (plain text)",
                id: "Yw09wC",
                description:
                  "Button text to download reporting requirements decision tree plain text.",
              })}
            </Link>
          </CardBasic>
        </div>
      </section>
      <section>
        <Heading
          Icon={FolderOpenIcon}
          size="h3"
          color="quaternary"
          data-h2-margin="base(x3, 0, x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Group-specific resources",
            id: "ewckox",
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
                      "These resources are designed to support digital initiative managers and leads in fulfilling their responsibilities under the Directive on Digital Talent. This implementation guidance explains why the directive is needed and what is required. Use the decision tree to navigate the reporting requirements.",
                    id: "Iz8E+y",
                    description:
                      "Body message for digital initiative managers section.",
                  })}
                </p>
              </div>
              <div data-h2-padding="base(x1)">
                <p data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage: "Implementation guidance for managers",
                    id: "wJ9hiY",
                    description:
                      "label above download guidance for managers pdf and text.",
                  })}
                </p>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Manager_PDF_EN.pdf"
                      : "/static/documents/Orientation_gestionnaire_PDF_FR.pdf"
                  }
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for managers (PDF)",
                    id: "FdXLKJ",
                    description:
                      "Aria label for download guidance for managers pdf link.",
                  })}
                  icon={ArrowDownOnSquareIcon}
                  data-h2-margin="base(x1, 0, x1, 0)"
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPdf)}
                </Link>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for managers (plain text)",
                    id: "thgFzS",
                    description:
                      "Aria label for download guidance for managers plain text link.",
                  })}
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Manager_text_EN.docx"
                      : "/static/documents/Orientation_gestionnaire_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPlainText)}
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
                      "Human resources (HR) advisors are responsible for ensuring clients looking for digital talent are aware of their obligations under the Directive on Digital Talent and supporting clients in leveraging flexibilities available in the HR policy suite to hire digital talent. These resources are designed to help HR advisors in carrying out these responsibilities.",
                    id: "pQwNEB",
                    description:
                      "Body message for digital initiative human resources section.",
                  })}
                </p>
              </div>
              <div data-h2-padding="base(x1)">
                <p data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage: "Implementation guidance for HR advisors",
                    id: "2etyqD",
                    description:
                      "Label above download guidance for human resources pdf and text.",
                  })}
                </p>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for HR advisors (PDF)",
                    id: "9gEfud",
                    description:
                      "Aria label for download guidance for human resources pdf link.",
                  })}
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_HR_PDF_EN.pdf"
                      : "/static/documents/Orientation_RH_PDF_FR.pdf"
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-margin="base(x1, 0, x1, 0)"
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPdf)}
                </Link>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for HR advisors (plain text)",
                    id: "eEXEtz",
                    description:
                      "Aria label for download guidance for human resources plain text link.",
                  })}
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_HR_text_EN.docx"
                      : "/static/documents/Orientation_RH_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPlainText)}
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
                      "The Directive does not introduce any additional procedural steps for procurement officers, but there are procurement-related reporting requirements that fall to digital initiative leads. These resources are designed to help procurement officers in supporting their clients when they procure digital services (e.g. digital talent, IT-related, IM-related, etc.).",
                    id: "b8mC0r",
                    description:
                      "Body message for digital initiative procurement section.",
                  })}
                </p>
              </div>
              <div data-h2-padding="base(x1)">
                <p data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Implementation guidance for procurement officers",
                    id: "QjXLW4",
                    description:
                      "Label above download guidance for procurement pdf and text.",
                  })}
                </p>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Procurement_PDF_EN.pdf"
                      : "/static/documents/Orientation_approvisionnement_PDF_FR.pdf"
                  }
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for procurement officers (PDF)",
                    id: "TKD+D2",
                    description:
                      "Aria label for download guidance for procurement officers pdf link.",
                  })}
                  icon={ArrowDownOnSquareIcon}
                  data-h2-margin="base(x1, 0, x1, 0)"
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPdf)}
                </Link>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for procurement officers (plain text)",
                    id: "FtxUlB",
                    description:
                      "Aria label for download guidance for procurement officers plain text link.",
                  })}
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Procurement_text_EN.docx"
                      : "/static/documents/Orientation_approvisionnement_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPlainText)}
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
