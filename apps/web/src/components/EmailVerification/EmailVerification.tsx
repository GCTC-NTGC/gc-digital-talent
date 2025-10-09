import { useContext } from "react";

import Provider, {
  EmailVerificationContext,
  Value as ProviderValue,
} from "./EmailVerificationProvider";
import RequestVerificationCodeContextMessage from "./RequestVerificationCodeContextMessage";
import RequestVerificationCodeForm from "./RequestVerificationCodeForm";
import SubmitVerificationCodeContextMessage from "./SubmitVerificationCodeContextMessage";

// a group of composable components to construct a form with email verification
const EmailVerification = {
  // a wrapping context provider to synchronize state
  Provider,
  // a form to request a verification email
  RequestVerificationCodeForm,
  // a context message for the verification email request form
  RequestVerificationCodeContextMessage,
  // a context message for the verification code submit form
  SubmitVerificationCodeContextMessage,
};

// a hook to easily use the provider
export const useEmailVerification = (): ProviderValue => {
  const value = useContext(EmailVerificationContext);

  return value;
};

export default EmailVerification;
