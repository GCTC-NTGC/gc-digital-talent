import { Color, IconType, Link } from "@gc-digital-talent/ui";

export interface ButtonLinkType {
  icon: IconType;
  text: string;
  url: string;
  color: Color;
}

interface ButtonLinksArrayProps {
  buttonLinkArray: ButtonLinkType[];
  centered: boolean;
}

const ButtonLinksArray = ({
  buttonLinkArray,
  centered,
}: ButtonLinksArrayProps) => (
  <ul
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25, x.25)"
    data-h2-list-style="base(none)"
    data-h2-padding="base(0)"
    {...(centered
      ? {
          "data-h2-justify-content": "base(center)",
        }
      : {})}
  >
    {buttonLinkArray.map((element) => (
      <li key={element.url}>
        <Link
          color={element.color}
          mode="cta"
          href={element.url}
          icon={element.icon}
        >
          {element.text}
        </Link>
      </li>
    ))}
  </ul>
);

export default ButtonLinksArray;
