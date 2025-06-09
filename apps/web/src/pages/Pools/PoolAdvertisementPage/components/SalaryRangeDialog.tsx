import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import { ReactNode } from "react";

import { Button, Dialog, Link, LinkProps, Ol } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

const generateLink = (href: LinkProps["href"], chunks: ReactNode) => (
  <Link newTab external href={href}>
    {chunks}
  </Link>
);

const rateOfPayUrl = {
  en: "https://www.tbs-sct.canada.ca/pubs_pol/hrpubs/coll_agre/rates-taux-eng.asp",
  fr: "https://www.tbs-sct.canada.ca/pubs_pol/hrpubs/coll_agre/rates-taux-fra.asp",
} as const;

const rateOfPayNonUnionUrl = {
  en: "https://www.canada.ca/en/treasury-board-secretariat/services/pay/rates-pay/rates-pay-unrepresented-senior-excluded-employees.html",
  fr: "https://www.canada.ca/fr/secretariat-conseil-tresor/services/remuneration/taux-remuneration/taux-remuneration-employes-non-representes-exclus-niveaux-superieurs.html",
} as const;

const DeadlineDialog = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          mode="icon_only"
          color="secondary"
          icon={InformationCircleIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Learn more about salary ranges",
            id: "AAisdi",
            description:
              "Info button label for pool application salary range details.",
          })}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Salary range",
            id: "rdxU+x",
            description: "Heading for the salary ranges dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x.5)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The salary ranges for all federal public service positions are <link>shared publicly</link>. The job advertisement shows the full range for this type of position.",
                  id: "KYXYsD",
                  description:
                    "First paragraph for the pool application salary ranges dialog",
                },
                {
                  link: (chunks: ReactNode) =>
                    generateLink(rateOfPayUrl[locale], chunks),
                },
              )}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Most new hires will start at the lowest salary in the applicable range. <strong>To start at a higher rate</strong>, the hiring manager will need to justify why a salary above the minimum is considered necessary to obtain a suitably qualified person. They’ll need to explain how the position meets 1 of 3 conditions:",
                id: "1JtwAU",
                description:
                  "Second paragraph for the pool application salary ranges dialog",
              })}
            </p>
            <Ol space="lg">
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "There is a <strong>shortage of skilled workers</strong> in the field, based on local or regional labour market surveys from recognized institutions.",
                  id: "zA8GrW",
                  description:
                    "List of conditions for starting at a higher rate, item 1",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "There are <strong>unusual difficulties in filling the role</strong> with qualified candidates, possibly because the minimum rate in the salary range isn’t competitive.",
                  id: "57DYUv",
                  description:
                    "List of conditions for starting at a higher rate, item 2",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "There is a <strong>need for a highly skilled or experienced employee</strong> who can immediately take on the full responsibilities of the position.",
                  id: "11/un8",
                  description:
                    "List of conditions for starting at a higher rate, item 3",
                })}
              </li>
            </Ol>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Once you’re hired, you’ll move up a step in the salary range each year on the anniversary of your start date. This will continue until you reach the maximum rate. Once you’re at the highest step, your salary will change only if your collective agreement changes or if you take a new job at a higher level.",
                id: "TgjkyB",
                description:
                  "Third paragraph for the pool application salary ranges dialog",
              })}
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "You can find the salary ranges and steps for most Government of Canada jobs in <link1>the collective agreements</link1>. For non-unionized positions, the salary range is available on the <link2>Treasury Board of Canada Secretariat’s website</link2>.",
                  id: "PROKKo",
                  description:
                    "Fourth paragraph for the pool application salary ranges dialog",
                },
                {
                  link1: (chunks: ReactNode) =>
                    generateLink(rateOfPayUrl[locale], chunks),
                  link2: (chunks: ReactNode) =>
                    generateLink(rateOfPayNonUnionUrl[locale], chunks),
                },
              )}
            </p>
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "4p0QdF",
                  description: "Button text used to close an open modal",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeadlineDialog;
