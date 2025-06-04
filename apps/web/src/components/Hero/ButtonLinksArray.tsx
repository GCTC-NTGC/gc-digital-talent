import { IconType, CTALink, CTALinkProps } from "@gc-digital-talent/ui";

export interface ButtonLinkType {
  icon: IconType;
  text: string;
  url: string;
  color: CTALinkProps["color"];
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
    data-h2-gap="base(x.50, x.50)"
    data-h2-list-style="base(none)"
    data-h2-padding="base(0)"
    {...(centered
      ? {
          "data-h2-justify-content": "base(center)",
        }
      : {
          "data-h2-justify-content": "base(center) p-tablet(flex-start)",
        })}
  >
    {buttonLinkArray.map((element) => (
      <li key={element.url}>
        <CTALink color={element.color} href={element.url} icon={element.icon}>
          {element.text}
        </CTALink>
      </li>
    ))}
  </ul>
);

export default ButtonLinksArray;
