import { createContext, useContext } from "react";

interface EditPoolContextState {
  isSubmitting: boolean;
}

const defaultContext: EditPoolContextState = {
  isSubmitting: false,
};

const EditPoolContext =
  createContext<EditPoolContextState>(defaultContext);

export const useEditPoolContext = () => {
  const state = useContext(EditPoolContext);

  return state;
};

export default EditPoolContext;
