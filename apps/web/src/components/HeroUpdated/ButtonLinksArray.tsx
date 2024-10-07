import { IconType, Link } from "@gc-digital-talent/ui";

interface ButtonLinkType {
  icon: IconType;
  text: string;
  url: string;
}

export interface ButtonLinksArrayProps {
  buttonLinkArray: ButtonLinkType[];
}

const ButtonLinksArray = ({ buttonLinkArray }: ButtonLinksArrayProps) => (
  <ul
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25, x.25)"
    data-h2-list-style="base(none)"
    data-h2-padding="base(0)"
  >
    {buttonLinkArray.map((element) => (
      <li key={element.url}>
        <Link color="quinary" mode="cta" href={element.url} icon={element.icon}>
          {element.text}
        </Link>
      </li>
    ))}
  </ul>
);

export default ButtonLinksArray;
