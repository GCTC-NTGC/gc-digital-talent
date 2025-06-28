import { useIntl } from "react-intl";
import { ReactNode, JSX } from "react";

import { Button, Dialog, Link, LinkProps } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

interface LocationState {
  referrer?: string;
}

const generateLink = (
  href: LinkProps["href"],
  state: LocationState,
  chunks: ReactNode,
) => (
  <Link newTab external href={href} state={state}>
    {chunks}
  </Link>
);

const ClosingDateDialog = ({ title }: { title: ReactNode }): JSX.Element => {
  const intl = useIntl();
  const routes = useRoutes();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button mode="text" color="black">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Learn about how deadlines work and what applicants will see when applying.",
            id: "77AbwY",
            description: "Subtitle for the pool closing date dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Understanding application deadlines",
            id: "HYeViW",
            description: "Heading for the pool closing date dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-3">
            {intl.formatMessage({
              defaultMessage:
                "In order to provide an equitable opportunity for all Canadians to apply to a position, deadlines close at <strong>11:59PM Pacific time</strong> on the date you select. When shown to applicants, we ask them to apply on or before the date you've chosen to avoid confusion around time zones.",
              id: "9EnhFG",
              description: "First paragraph for the pool closing date dialog",
            })}
          </p>
          <p className="mb-3">
            {intl.formatMessage({
              defaultMessage:
                "For example, if the deadline chosen is March 1st, 2024, applicants would see “Apply on or before March 1st, 2024”, with a hard deadline of 11:59PM Pacific time. For an applicant in the Eastern time zone, this would mean that they can technically apply before 2:59AM on March 2nd.",
              id: "C9jYms",
              description: "Second paragraph for pool closing date dialog",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Have further questions? Feel free to <link>reach out to our team</link> for more information.",
                id: "07p+1J",
                description: "Third paragraph for pool closing date dialog",
              },
              {
                link: (chunks: ReactNode) =>
                  generateLink(
                    routes.support(),
                    { referrer: window.location.href },
                    chunks,
                  ),
              },
            )}
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="primary">
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

export default ClosingDateDialog;
