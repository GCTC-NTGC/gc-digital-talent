import { Alert, Container } from "@gc-digital-talent/ui";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

interface BannerContentProps {
  title: string;
  message: string;
}

const BannerContent = ({ title, message }: BannerContentProps) => (
  <div className="bg-white py-6 dark:bg-gray-700">
    <Container size="lg" className="xs:px-6" center>
      <Alert.Root type="warning" live className="-mx-6 shadow-none">
        <Alert.Title>{title}</Alert.Title>
        <RichTextRenderer node={htmlToRichTextJSON(message)} />
      </Alert.Root>
    </Container>
  </div>
);

export default BannerContent;
