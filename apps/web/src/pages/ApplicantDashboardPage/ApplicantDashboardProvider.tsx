import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface ApplicantDashboardState {
  communityAccordionValue: string;
  setCommunityAccordionValue: Dispatch<SetStateAction<string>>;
  communityAccordionFocus: HTMLOrSVGElement["focus"];
  communityAccordionRef: () => void;
}

const defaultState = {
  communityAccordionValue: "",
  setCommunityAccordionValue: () => {
    /* no-op */
  },
  communityAccordionFocus: () => {
    /*no-op*/
  },
  communityAccordionRef: () => {
    /* no-op */
  },
} satisfies ApplicantDashboardState;

export const ApplicantDashboardContext =
  createContext<ApplicantDashboardState>(defaultState);

interface ApplicantDashboardProviderProps {
  children: ReactNode;
}

const ApplicantDashboardProvider = ({
  children,
}: ApplicantDashboardProviderProps) => {
  const [communityAccordionValue, setCommunityAccordionValue] =
    useState<string>("");

  return (
    <ApplicantDashboardContext.Provider
      value={{
        communityAccordionValue,
        setCommunityAccordionValue,
        communityAccordionFocus: defaultState.communityAccordionFocus,
        communityAccordionRef: defaultState.communityAccordionRef,
      }}
    >
      {children}
    </ApplicantDashboardContext.Provider>
  );
};

export default ApplicantDashboardProvider;
