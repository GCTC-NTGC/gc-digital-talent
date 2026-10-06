import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { SectionKey } from "../types";

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

  // Does nothing when the flag is already correct, so this cannot set off an endless update loop with the effect in useDirtyFields.
  const toggleDirty = useCallback((section: SectionKey, isDirty: boolean) => {
    setDirtySections((prevDirty) => {
      const alreadyDirty = prevDirty.includes(section);
      if (isDirty === alreadyDirty) {
        return prevDirty;
      }

      return isDirty
        ? [...prevDirty, section]
        : prevDirty.filter((dirtySection) => section !== dirtySection);
    });
  }, []);

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
