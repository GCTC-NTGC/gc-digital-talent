import { Button, ButtonProps } from "@gc-digital-talent/ui";

type PageButtonProps = Omit<ButtonProps, "mode" | "ref">;

const PageButton = (props: PageButtonProps) => (
  <Button
    mode="inline"
    size="sm"
    data-h2-vertical-align="base(middle)"
    {...props}
  />
);

export default PageButton;
