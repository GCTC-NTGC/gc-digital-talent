import { Button, ButtonProps } from "@gc-digital-talent/ui";

type PageButtonProps = Omit<ButtonProps, "mode" | "ref">;

const PageButton = (props: PageButtonProps) => (
  <Button mode="inline" size="sm" className="align-middle" {...props} />
);

export default PageButton;
