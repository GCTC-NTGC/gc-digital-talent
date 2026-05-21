import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface ApplicantDashboardState {
  communityAccordionValue: string;
  setCommunityAccordionValue: Dispatch<SetStateAction<string>>;
  communityAccordionRef: (node: HTMLButtonElement) => void;
  scrollAndExpandCommunitiesAccordion: () => void;
}

export const defaultState = {
  communityAccordionValue: "",
  setCommunityAccordionValue: () => {
    /* no-op */
  },
  communityAccordionRef: () => {
    /* no-op */
  },
  scrollAndExpandCommunitiesAccordion: () => {
    /* no-op */
  },
} satisfies ApplicantDashboardState;

export const ApplicantDashboardContext =
  createContext<ApplicantDashboardState>(defaultState);

interface ApplicantDashboardProviderProps {
  children: ReactNode;
  initialValue: ApplicantDashboardState;
}

const ApplicantDashboardProvider = ({
  children,
  initialValue,
}: ApplicantDashboardProviderProps) => {
  return (
    <ApplicantDashboardContext.Provider value={initialValue}>
      {children}
    </ApplicantDashboardContext.Provider>
  );
};

export default ApplicantDashboardProvider;
