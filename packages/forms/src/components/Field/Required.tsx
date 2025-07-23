export interface RequiredProps {
  required?: boolean;
}

const Required = ({ required }: RequiredProps) =>
  required ? (
    // eslint-disable-next-line formatjs/no-literal-string-in-jsx
    <span className="ml-1 text-error-500 dark:text-error-300">&ast;</span>
  ) : null;

export default Required;
