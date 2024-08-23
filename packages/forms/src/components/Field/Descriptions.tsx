import Context from "./Context";
import Error from "./Error";
import { DescriptionIds } from "../../hooks/useInputDescribedBy";
import { CommonInputProps } from "../../types";

export interface DescriptionsProps {
  context?: CommonInputProps["context"];
  error?: React.ReactNode;
  ids?: DescriptionIds;
}

const Descriptions = ({ context, error, ids }: DescriptionsProps) => (
  <>
    {context && <Context id={ids?.context}>{context}</Context>}
    {error && <Error id={ids?.error}>{error}</Error>}
  </>
);

export default Descriptions;
