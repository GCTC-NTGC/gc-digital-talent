import { Alert } from "@gc-digital-talent/ui";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

interface BannerContentProps {
  title: string;
  message: string;
}

const BannerContent = ({ title, message }: BannerContentProps) => (
  <div
    data-h2-background-color="base(foreground) base:dark(white)"
    data-h2-padding="base(x1, 0)"
  >
    <div data-h2-container="base(center, large, x1)">
      <Alert.Root
        type="warning"
        live
        data-h2-shadow="base(none)"
        data-h2-margin="base(0, -x1, 0, -x1)"
      >
        <Alert.Title>{title}</Alert.Title>
        <RichTextRenderer node={htmlToRichTextJSON(message)} />
      </Alert.Root>
    </div>
  </div>
);

export default BannerContent;
