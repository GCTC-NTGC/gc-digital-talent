import * as React from "react";

import { SectionKey } from "../types";

interface ProfileFormContextState {
  dirtySections: Array<SectionKey>;
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
  React.createContext<ProfileFormContextState>(defaultContext);

export const useProfileFormContext = () => {
  const state = React.useContext(ProfileFormContext);

  return state;
};

interface ProfileFormProviderProps {
  children: React.ReactNode;
}

const ProfileFormProvider = ({ children }: ProfileFormProviderProps) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [dirtySections, setDirtySections] = React.useState<Array<SectionKey>>(
    [],
  );

  const toggleDirty = React.useCallback(
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

  const state = React.useMemo(
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
