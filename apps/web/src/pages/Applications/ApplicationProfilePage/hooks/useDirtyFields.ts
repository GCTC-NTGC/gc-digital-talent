import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { useProfileFormContext } from "../components/ProfileFormContext";
import { SectionKey } from "../types";

const useDirtyFields = (section: SectionKey): void => {
  const { toggleDirty } = useProfileFormContext();
  const {
    formState: { isDirty },
  } = useFormContext();

  useEffect(() => {
    toggleDirty(section, isDirty);
  }, [isDirty, section, toggleDirty]);
};

export default useDirtyFields;
