import { useIntl } from "react-intl";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";

import { Card, Heading, Link } from "@gc-digital-talent/ui";
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
          icon={FolderOpenIcon}
          size="h3"
          color="warning"
          className="mt-18 mb-6"
        >
          {intl.formatMessage({
            defaultMessage: "Resources",
            id: "Kwfc/6",
            description:
              "Heading for section for the group-specific resources section.",
          })}
        </Heading>
        <div className="grid gap-6 xs:my-12 xs:grid-cols-2 sm:grid-cols-3">
          <Card className="flex flex-col overflow-hidden p-0">
            <div className="block bg-gray-700 p-6 text-white">
              <Heading level="h3" size="h6" className="my-0">
                {intl.formatMessage({
                  defaultMessage: "Digital initiative managers",
                  id: "Tvsi5A",
                  description: "Title for group-specific resource card",
                })}
              </Heading>
            </div>
            <div className="flex grow flex-col justify-between">
              <div>
                <img src={managers} alt="" className="hidden xs:block" />

                <p className="m-6">
                  {intl.formatMessage({
                    defaultMessage:
                      "This implementation guidance is designed to support digital initiative managers and leads in fulfilling their responsibilities under the <cite>Directive on Digital Talent</cite>. It explains why the directive is needed and what is required.",
                    id: "vYi5/y",
                    description:
                      "Body message for digital initiative managers section.",
                  })}
                </p>
              </div>
              <div className="p-6">
                <Link
                  mode="text"
                  className="font-bold"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Manager_text_EN.docx"
                      : "/static/documents/Orientation_gestionnaire_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
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
          </Card>
          <Card className="flex flex-col overflow-hidden p-0">
            <div className="block bg-gray-700 p-6 text-white">
              <Heading level="h3" size="h6" className="my-0">
                {intl.formatMessage({
                  defaultMessage: "Human resources advisors",
                  id: "x+kUrO",
                  description: "Title for group-specific resource card",
                })}
              </Heading>
            </div>
            <div className="flex grow flex-col justify-between">
              <div>
                <img src={hr} alt="" className="hidden xs:block" />
                <p className="m-6">
                  {intl.formatMessage({
                    defaultMessage:
                      "Human resources (HR) advisors are responsible for ensuring clients looking for digital talent are aware of their obligations under the <cite>Directive on Digital Talent</cite> and supporting clients in leveraging flexibilities available in the HR policy suite to hire digital talent. This implementation guidance is designed to help HR advisors in carrying out these responsibilities.",
                    id: "Msshus",
                    description:
                      "Body message for digital initiative human resources section.",
                  })}
                </p>
              </div>
              <div className="p-6">
                <Link
                  mode="text"
                  className="font-bold"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_HR_text_EN.docx"
                      : "/static/documents/Orientation_RH_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
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
          </Card>
          <Card className="flex flex-col overflow-hidden p-0">
            <div className="block bg-gray-700 p-6 text-white">
              <Heading level="h3" size="h6" className="my-0">
                {intl.formatMessage({
                  defaultMessage: "Procurement officers",
                  id: "n92mcX",
                  description: "Title for procurement officer resource card",
                })}
              </Heading>
            </div>
            <div className="flex grow flex-col justify-between">
              <div>
                <img src={procurement} alt="" className="hidden xs:block" />
                <p className="m-6">
                  {intl.formatMessage({
                    defaultMessage:
                      "The Directive does not introduce any additional procedural steps for procurement officers, but there are procurement-related reporting requirements that fall to business owners. This resource is designed to help procurement officers in supporting their clients when they procure digital services (e.g. digital talent, IT-related, IM-related, etc.).",
                    id: "+76ObM",
                    description:
                      "Body message for digital initiative procurement section.",
                  })}
                </p>
              </div>
              <div className="p-6">
                <Link
                  mode="text"
                  className="font-bold"
                  block
                  external
                  download
                  href={
                    locale === "en"
                      ? "/static/documents/Guidance_Procurement_text_EN.docx"
                      : "/static/documents/Orientation_approvisionnement_texte_FR.docx"
                  }
                  icon={ArrowDownOnSquareIcon}
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
          </Card>
        </div>
      </section>
    </>
  );
};

export default Resources;
