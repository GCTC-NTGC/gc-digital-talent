import { useEffect } from "react";
import { useFormState } from "react-hook-form";

import { useProfileFormContext } from "../components/ProfileFormContext";
import { SectionKey } from "../types";

const useDirtyFields = (section: SectionKey): void => {
  const { toggleDirty } = useProfileFormContext();
  const { isDirty } = useFormState();

  useEffect(() => {
    toggleDirty(section, isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);
};

export default useDirtyFields;
