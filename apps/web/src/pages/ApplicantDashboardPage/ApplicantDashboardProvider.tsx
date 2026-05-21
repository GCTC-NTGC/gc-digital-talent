import {
  createContext,
  createRef,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";

interface ApplicantDashboardState {
  communityAccordionValue: string;
  setCommunityAccordionValue: Dispatch<SetStateAction<string>>;
  communityAccordionFocus: (() => void) | undefined;
  communityAccordionRef: RefObject<HTMLButtonElement | null>;
}

export const defaultState = {
  communityAccordionValue: "",
  setCommunityAccordionValue: () => {
    /* no-op */
  },
  communityAccordionFocus: undefined,
  communityAccordionRef: createRef<HTMLButtonElement>(),
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
