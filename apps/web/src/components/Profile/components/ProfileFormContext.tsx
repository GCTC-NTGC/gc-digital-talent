import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { SectionKey } from "../types";

interface ProfileFormContextState {
  dirtySections: SectionKey[];
  isSubmitting: boolean;
  setSubmitting: (newSubmitting: boolean) => void;
  toggleDirty: (section: SectionKey, isDirty: boolean) => void;
}

const defaultContext: ProfileFormContextState = {
  dirtySections: [],
  isSubmitting: false,
  setSubmitting: () => {
    /** do nothing */
  },
  toggleDirty: () => {
    /** do nothing */
  },
};

const ProfileFormContext =
  createContext<ProfileFormContextState>(defaultContext);

export const useProfileFormContext = () => {
  const state = useContext(ProfileFormContext);

  return state;
};

interface ProfileFormProviderProps {
  children: ReactNode;
}

const ProfileFormProvider = ({ children }: ProfileFormProviderProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [dirtySections, setDirtySections] = useState<SectionKey[]>([]);

  const toggleDirty = useCallback(
    (section: SectionKey, isDirty: boolean) => {
      let newDirty = dirtySections;
      if (isDirty) {
        if (!dirtySections.find((dirtySection) => section === dirtySection)) {
          newDirty = [...newDirty, section];
        }
      } else {
        newDirty = newDirty.filter((dirtySection) => section !== dirtySection);
      }

      setDirtySections(newDirty);
    },
    [dirtySections],
  );

  const toggleSubmitting = (newIsSubmitting: boolean) => {
    setSubmitting(newIsSubmitting);
  };

  const state = useMemo(
    () => ({
      isSubmitting,
      dirtySections,
      setSubmitting: toggleSubmitting,
      toggleDirty,
    }),
    [isSubmitting, toggleDirty, dirtySections],
  );

  return (
    <ProfileFormContext.Provider value={state}>
      {children}
    </ProfileFormContext.Provider>
  );
};

export default ProfileFormProvider;
