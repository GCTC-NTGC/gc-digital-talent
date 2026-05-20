import {
  createContext,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type Ref,
  type SetStateAction,
} from "react";

interface ApplicantDashboardState {
  communityAccordionValue: string;
  setCommunityAccordionValue: Dispatch<SetStateAction<string>>;
  communityAccordionRef: Ref<HTMLButtonElement> | undefined;
}

const defaultState = {
  communityAccordionValue: "",
  setCommunityAccordionValue: () => {
    /* no-op */
  },
  communityAccordionRef: undefined,
} satisfies ApplicantDashboardState;

export const ApplicantDashboardContext =
  createContext<ApplicantDashboardState>(defaultState);

interface ApplicantDashboardProviderProps {
  children: ReactNode;
}

const ApplicantDashboardProvider = ({
  children,
}: ApplicantDashboardProviderProps) => {
  const communityAccordionRef = useRef<HTMLButtonElement>(null);

  const [communityAccordionValue, setCommunityAccordionValue] =
    useState<string>("");

  return (
    <ApplicantDashboardContext.Provider
      value={{
        communityAccordionValue,
        setCommunityAccordionValue,
        communityAccordionRef,
      }}
    >
      {children}
    </ApplicantDashboardContext.Provider>
  );
};

export default ApplicantDashboardProvider;
