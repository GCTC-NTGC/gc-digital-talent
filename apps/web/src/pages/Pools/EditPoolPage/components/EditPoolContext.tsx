import React from "react";

interface EditPoolContextState {
  isSubmitting: boolean;
}

const defaultContext: EditPoolContextState = {
  isSubmitting: false,
};

const EditPoolContext =
  React.createContext<EditPoolContextState>(defaultContext);

export const useEditPoolContext = () => {
  const state = React.useContext(EditPoolContext);

  return state;
};

export default EditPoolContext;
