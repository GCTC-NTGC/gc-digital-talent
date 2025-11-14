import { Notice, Container } from "@gc-digital-talent/ui";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

interface BannerContentProps {
  title: string;
  message: string;
}

const BannerContent = ({ title, message }: BannerContentProps) => (
  <div className="bg-white py-6 dark:bg-gray-700">
    <Container size="lg" className="xs:px-6" center>
      <Notice.Root
        color="warning"
        className="-mx-6 mb-0 shadow-none"
        role="alert"
        mode="card"
      >
        <Notice.Title as="p" defaultIcon>
          {title}
        </Notice.Title>
        <Notice.Content>
          <RichTextRenderer node={htmlToRichTextJSON(message)} />
        </Notice.Content>
      </Notice.Root>
    </Container>
  </div>
);

export default BannerContent;
