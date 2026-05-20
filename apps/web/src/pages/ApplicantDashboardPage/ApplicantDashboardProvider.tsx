import {
  createContext,
  createRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";

interface ApplicantDashboardState {
  communityAccordionValue: string;
  setCommunityAccordionValue: Dispatch<SetStateAction<string>>;
  communityAccordionRef: RefObject<HTMLButtonElement | null>;
}

const defaultState = {
  communityAccordionValue: "",
  setCommunityAccordionValue: () => {
    /* no-op */
  },
  communityAccordionRef: createRef<HTMLButtonElement>(),
} satisfies ApplicantDashboardState;

export const ApplicantDashboardContext =
  createContext<ApplicantDashboardState>(defaultState);

interface ApplicantDashboardProviderProps {
  children: ReactNode;
}

const ApplicantDashboardProvider = ({
  children,
}: ApplicantDashboardProviderProps) => {
  const communityAccordionRef = createRef<HTMLButtonElement>();

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
