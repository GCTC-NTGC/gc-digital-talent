export interface RequiredProps {
  required?: boolean;
}

const Required = ({ required }: RequiredProps) =>
  required ? (
    <span data-h2-color="base(error.dark) base:dark(error.lightest)"> *</span>
  ) : null;

export default Required;
