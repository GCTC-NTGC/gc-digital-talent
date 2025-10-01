import { createContext, ReactNode, useContext, useState } from "react";

type RequestACodeContextMessage =
  | "request-sent"
  | "throttled"
  | "address-changed";
type SubmitACodeContextMessage = "contact-matches-work" | "must-request-code";

export interface EmailVerificationState {
  requestACodeMessage: RequestACodeContextMessage | null;
  submitACodeMessage: SubmitACodeContextMessage | null;
  emailAddressContacted: string | null;
  setRequestACodeMessage: (message: RequestACodeContextMessage | null) => void;
  setSubmitACodeMessage: (message: SubmitACodeContextMessage | null) => void;
  setEmailAddressContacted: (emailAddress: string | null) => void;
}

const defaultEmailVerificationState: EmailVerificationState = {
  requestACodeMessage: null,
  submitACodeMessage: null,
  emailAddressContacted: null,
  setRequestACodeMessage: (_) => {
    // NO-OP
  },
  setSubmitACodeMessage: (_) => {
    // NO-OP
  },
  setEmailAddressContacted: (_) => {
    // NO-OP
  },
};

export const EmailVerificationContext = createContext<EmailVerificationState>(
  defaultEmailVerificationState,
);

export const useEmailVerification = (): EmailVerificationState => {
  const state = useContext(EmailVerificationContext);

  return state;
};

interface EmailVerificationProviderProps {
  children: ReactNode;
}

const EmailVerificationProvider = ({
  children,
}: EmailVerificationProviderProps) => {
  const [requestACodeMessage, setRequestACodeMessage] =
    useState<EmailVerificationState["requestACodeMessage"]>(null);
  const [submitACodeMessage, setSubmitACodeMessage] =
    useState<EmailVerificationState["submitACodeMessage"]>(null);
  const [emailAddressContacted, setEmailAddressContacted] =
    useState<EmailVerificationState["emailAddressContacted"]>(null);

  const state = {
    requestACodeMessage,
    submitACodeMessage,
    emailAddressContacted,
    setRequestACodeMessage,
    setSubmitACodeMessage,
    setEmailAddressContacted,
  };

  return (
    <EmailVerificationContext.Provider value={state}>
      {children}
    </EmailVerificationContext.Provider>
  );
};

export default EmailVerificationProvider;
