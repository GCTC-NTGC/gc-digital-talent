import { useEffect } from "react";
import { useFormState } from "react-hook-form";

import { useProfileFormContext } from "../components/ProfileFormContext";
import type { SectionKey } from "../types";

const useDirtyFields = (section: SectionKey): void => {
  const { toggleDirty } = useProfileFormContext();
  const { isDirty } = useFormState();

  useEffect(() => {
    // Reports dirty state upwards so all sections can be validated at once.
    // Safe to depend on toggleDirty: ProfileFormContext keeps its identity stable.
    toggleDirty(section, isDirty);
  }, [isDirty, section, toggleDirty]);
};

export default useDirtyFields;
