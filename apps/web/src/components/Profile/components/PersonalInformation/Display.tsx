import { useMutation } from "urql";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { graphql, User } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { empty } from "@gc-digital-talent/helpers";
import { Button, Chip, Link } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { useAuthorization } from "@gc-digital-talent/auth";

import profileMessages from "~/messages/profileMessages";
import useRoutes from "~/hooks/useRoutes";

import FieldDisplay from "../FieldDisplay";

const SendVerificationEmail_Mutation = graphql(/* GraphQL */ `
  mutation SendVerificationEmail($id: ID!) {
    sendUserEmailVerification(id: $id) {
      id
      email
    }
  }
`);

type PartialUser = Pick<
  User,
  | "firstName"
  | "lastName"
  | "email"
  | "isEmailVerified"
  | "telephone"
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "currentCity"
  | "currentProvince"
  | "citizenship"
  | "armedForcesStatus"
>;

interface DisplayProps {
  user: PartialUser;
  showEmailVerification?: boolean;
}

const Display = ({
  user: {
    firstName,
    lastName,
    email,
    isEmailVerified,
    telephone,
    preferredLang,
    preferredLanguageForInterview,
    preferredLanguageForExam,
    currentCity,
    currentProvince,
    citizenship,
    armedForcesStatus,
  },
  showEmailVerification = false,
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { userAuthInfo } = useAuthorization();
  const navigate = useNavigate();
  const routes = useRoutes();

  const [{ fetching: mutationSubmitting }, executeSendEmailMutation] =
    useMutation(SendVerificationEmail_Mutation);

  const handleVerifyNowClick = () => {
    executeSendEmailMutation({
      id: userAuthInfo?.id,
    })
      .then((result) => {
        if (result.data?.sendUserEmailVerification) {
          navigate(
            routes.verifyContactEmail({
              emailAddress: result.data.sendUserEmailVerification.email,
            }),
          );
        } else {
          throw new Error("Failed to submit");
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage(commonMessages.error));
      });
  };

  const emailVerificationComponents = isEmailVerified ? (
    <Chip color="success">
      {intl.formatMessage({
        defaultMessage: "Verified",
        id: "GMglI5",
        description: "The email address has been verified to be owned by user",
      })}
    </Chip>
  ) : (
    <>
      <Chip color="error">
        {intl.formatMessage({
          defaultMessage: "Unverified",
          id: "tUIvbq",
          description:
            "The email address has not been verified to be owned by user",
        })}
      </Chip>
      <Button
        type="button"
        mode="inline"
        color="error"
        data-h2-margin="base(0 0 x.15 0)" // line up with chip
        onClick={handleVerifyNowClick}
        disabled={mutationSubmitting}
      >
        {intl.formatMessage({
          defaultMessage: "Verify now",
          id: "ADPfNp",
          description: "Button to start the email address verification process",
        })}
      </Button>
    </>
  );

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))"
      data-h2-gap="base(x1)"
    >
      <FieldDisplay
        hasError={!firstName}
        label={intl.formatMessage({
          defaultMessage: "Given name",
          id: "DUh8zg",
          description: "Label for given name field",
        })}
      >
        {firstName || notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!lastName}
        label={intl.formatMessage({
          defaultMessage: "Surname",
          id: "dssZUt",
          description: "Label for surname field",
        })}
      >
        {lastName || notProvided}
      </FieldDisplay>
      <div
        data-h2-grid-column-start="p-tablet(1)"
        data-h2-grid-column-end="p-tablet(span 2) l-tablet(span 3)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-gap="base(x0.5)"
        data-h2-align-items="base(end)"
      >
        <FieldDisplay
          hasError={!email}
          label={intl.formatMessage(commonMessages.email)}
          data-h2-margin="base(0 0 x.15 0)" // line up with chip
        >
          {email || notProvided}
        </FieldDisplay>
        {showEmailVerification ? emailVerificationComponents : null}
      </div>
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
      <FieldDisplay
        hasError={!currentCity}
        label={intl.formatMessage({
          defaultMessage: "Current city",
          id: "de/Vcy",
          description: "Label for current city field in About Me form",
        })}
      >
        {currentCity || notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!currentProvince}
        label={intl.formatMessage({
          defaultMessage: "Province or territory",
          id: "yzgwjd",
          description: "Label for current province or territory field",
        })}
      >
        {currentProvince?.label
          ? getLocalizedName(currentProvince.label, intl)
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLang}
        label={intl.formatMessage({
          defaultMessage: "Communication language",
          id: "ceofev",
          description: "Legend text for communication language preference",
        })}
      >
        {preferredLang?.label
          ? getLocalizedName(preferredLang.label, intl)
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLanguageForInterview}
        label={intl.formatMessage({
          defaultMessage: "Spoken interview language",
          id: "ehrsDa",
          description:
            "Legend text for spoken interview language preference for interviews",
        })}
      >
        {preferredLanguageForInterview?.label
          ? getLocalizedName(preferredLanguageForInterview.label, intl)
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!preferredLanguageForExam}
        label={intl.formatMessage({
          defaultMessage: "Written exam language",
          id: "boPmF+",
          description:
            "Legend text for written exam language preference for exams",
        })}
      >
        {preferredLanguageForExam?.label
          ? getLocalizedName(preferredLanguageForExam.label, intl)
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={empty(armedForcesStatus)}
        label={intl.formatMessage(profileMessages.veteranStatus)}
        data-h2-grid-column-start="p-tablet(1)"
        data-h2-grid-column-end="p-tablet(span 2) l-tablet(span 3)"
      >
        {armedForcesStatus?.value
          ? intl.formatMessage(
              getArmedForcesStatusesProfile(armedForcesStatus.value, false),
            )
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        hasError={!citizenship}
        label={intl.formatMessage({
          defaultMessage: "Citizenship status",
          id: "4v9y7U",
          description: "Citizenship status label",
        })}
        data-h2-grid-column-start="p-tablet(1)"
        data-h2-grid-column-end="p-tablet(span 2) l-tablet(span 3)"
      >
        {citizenship?.value
          ? intl.formatMessage(getCitizenshipStatusesProfile(citizenship.value))
          : notProvided}
      </FieldDisplay>
    </div>
  );
};

export default Display;
