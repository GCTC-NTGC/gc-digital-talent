import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import useRoutes from "~/hooks/useRoutes";

import EmailVerificationStatus from "../EmailVerificationStatus";

const PersonalInformationDisplay_Fragment = graphql(/** GraphQL */ `
  fragment PersonalInformationDisplay on User {
    firstName
    lastName
    email
    isEmailVerified
    telephone
  }
`);

interface DisplayProps {
  query: FragmentType<typeof PersonalInformationDisplay_Fragment>;
  showEmailVerification?: boolean;
  readOnly?: boolean;
  showEmail?: boolean;
}

const Display = ({
  query,
  showEmailVerification = false,
  readOnly = false,
  showEmail = false,
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const navigate = useNavigate();
  const routes = useRoutes();
  const user = getFragment(PersonalInformationDisplay_Fragment, query);

  const { firstName, lastName, email, isEmailVerified, telephone } = user;

  const handleVerifyNowClick = async () => {
    await navigate(
      routes.verifyContactEmail({
        emailAddress: email,
      }),
    );
  };

  return (
    <div className="grid gap-6 xs:grid-cols-2 sm:grid-cols-3">
      <FieldDisplay
        hasError={!firstName}
        label={intl.formatMessage({
          defaultMessage: "Given name",
          id: "DUh8zg",
          description: "Label for given name field",
        })}
      >
        {firstName ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!lastName}
        label={intl.formatMessage({
          defaultMessage: "Surname",
          id: "dssZUt",
          description: "Label for surname field",
        })}
      >
        {lastName ?? notProvided}
      </FieldDisplay>
      {showEmail && (
        <div className="xs:col-span-2 sm:col-span-3">
          <FieldDisplay
            hasError={!email}
            label={intl.formatMessage(commonMessages.email)}
          >
            <div className="flex items-center gap-3">
              <span>{email ?? notProvided}</span>
              {showEmailVerification ? (
                <EmailVerificationStatus
                  isEmailVerified={!!isEmailVerified}
                  onClickVerify={handleVerifyNowClick}
                  readOnly={readOnly}
                />
              ) : null}
            </div>
          </FieldDisplay>
        </div>
      )}
      <FieldDisplay
        hasError={!telephone}
        label={intl.formatMessage(commonMessages.telephone)}
      >
        {telephone ? (
          <Link
            color="black"
            external
            href={`tel:${telephone}`}
            aria-label={telephone.replace(/.{1}/g, "$& ")}
          >
            {telephone}
          </Link>
        ) : (
          notProvided
        )}
      </FieldDisplay>
    </div>
  );
};

export default Display;
