import { InstructionList, InstructionListProps } from "./InstructionList";
import { InstructionStep, InstructionStepProps } from "./InstructionStep";

const Instructions = {
  Step: InstructionStep,
  List: InstructionList,
};

export default Instructions;
export type { InstructionListProps, InstructionStepProps };
