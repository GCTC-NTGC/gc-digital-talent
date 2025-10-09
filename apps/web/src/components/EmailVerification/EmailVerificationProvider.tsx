import { createContext, ReactNode, useState } from "react";

import type { ContextMessage as RequestCodeMessage } from "./RequestVerificationCodeContextMessage";
import type { ContextMessage as SubmitCodeMessage } from "./SubmitVerificationCodeContextMessage";

interface State {
  requestVerificationCodeContextMessage: RequestCodeMessage | null;
  submitVerificationCodeContextMessage: SubmitCodeMessage | null;
  emailAddressContacted: string | null;
}

interface Actions {
  setRequestVerificationCodeContextMessage: (
    message: RequestCodeMessage | null,
  ) => void;
  setSubmitVerificationCodeContextMessage: (
    message: SubmitCodeMessage | null,
  ) => void;
  setEmailAddressContacted: (emailAddress: string | null) => void;
}

export interface Value {
  state: State;
  actions: Actions;
}

export const EmailVerificationContext = createContext<Value>({
  state: {
    requestVerificationCodeContextMessage: null,
    submitVerificationCodeContextMessage: null,
    emailAddressContacted: null,
  },
  actions: {
    setRequestVerificationCodeContextMessage: (_) => {
      // NO-OP
    },
    setSubmitVerificationCodeContextMessage: (_) => {
      // NO-OP
    },
    setEmailAddressContacted: (_) => {
      // NO-OP
    },
  },
});

interface EmailVerificationProviderProps {
  children: ReactNode;
}

const EmailVerificationProvider = ({
  children,
}: EmailVerificationProviderProps) => {
  const [
    requestVerificationCodeContextMessage,
    setRequestVerificationCodeContextMessage,
  ] = useState<State["requestVerificationCodeContextMessage"]>(null);
  const [
    submitVerificationCodeContextMessage,
    setSubmitVerificationCodeContextMessage,
  ] = useState<State["submitVerificationCodeContextMessage"]>(null);
  const [emailAddressContacted, setEmailAddressContacted] =
    useState<State["emailAddressContacted"]>(null);

  return (
    <EmailVerificationContext.Provider
      value={{
        state: {
          requestVerificationCodeContextMessage,
          submitVerificationCodeContextMessage,
          emailAddressContacted,
        },
        actions: {
          setRequestVerificationCodeContextMessage,
          setSubmitVerificationCodeContextMessage,
          setEmailAddressContacted,
        },
      }}
    >
      {children}
    </EmailVerificationContext.Provider>
  );
};

export default EmailVerificationProvider;
