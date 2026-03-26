import { useIntl } from "react-intl";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";

import { Card, Heading, Link } from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";

interface FooterCardProps {
  areOpportunitiesShowing: boolean;
}

const FooterCard = ({ areOpportunitiesShowing }: FooterCardProps) => {
  const intl = useIntl();
  const { loggedIn } = useAuthentication();
  const paths = useRoutes();

  const profileLink = {
    href: loggedIn ? paths.profile() : paths.login(),
    label: loggedIn
      ? intl.formatMessage({
          defaultMessage: "Update my profile",
          id: "jfCwes",
          description:
            "Link text to direct users to the profile page when signed in",
        })
      : intl.formatMessage({
          defaultMessage: "Create a profile",
          id: "wPpvvm",
          description:
            "Link text to direct users to the profile page when anonymous",
        }),
  };

  return (
    <Card className="mt-6">
      <div className="items-center justify-between gap-18 xs:flex">
        <div className="text-center xs:text-left">
          <Heading level="h2" size="h6" className="mt-0 mb-3 lg:text-lg">
            {areOpportunitiesShowing
              ? intl.formatMessage({
                  defaultMessage: "Check back for more opportunities",
                  id: "1mjUju",
                  description:
                    "Heading for message about upcoming opportunities",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "No opportunities are available right now, but more are coming soon",
                  id: "EtAtP4",
                  description:
                    "Text displayed when there are no pool advertisements to display",
                })}
          </Heading>
          <p>
            {loggedIn
              ? intl.formatMessage({
                  defaultMessage:
                    "We're posting new job opportunities all the time. By keeping your profile up to date, you'll be able to submit applications lightning fast when the time comes.",
                  id: "8hnMtx",
                  description:
                    "Text describing upcoming opportunities instructing users to update a profile when signed in",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "We're posting new job opportunities all the time. By starting your profile now, you'll be able to submit applications lightning fast when the time comes.",
                  id: "PH5Lah",
                  description:
                    "Text describing upcoming opportunities instructing users to create a profile when anonymous",
                })}
          </p>
        </div>
        <div className="mt-6 flex shrink-0 justify-center xs:mt-0 xs:block">
          <Link
            color="secondary"
            mode="solid"
            href={profileLink.href}
            style={{ whiteSpace: "nowrap" }}
            className="inline-flex items-center"
          >
            {!loggedIn && (
              <UserPlusIcon
                className="mr-1.5 inline-block h-5 w-5 fill-current align-middle"
                aria-hidden="true"
              />
            )}

            {profileLink.label}
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default FooterCard;
