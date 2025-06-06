export interface RequiredProps {
  required?: boolean;
}

const Required = ({ required }: RequiredProps) =>
  required ? (
    // eslint-disable-next-line formatjs/no-literal-string-in-jsx
    <span className="text-error-500 dark:text-error-300"> *</span>
  ) : null;

export default Required;
