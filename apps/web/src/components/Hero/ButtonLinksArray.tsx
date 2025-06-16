import { tv } from "tailwind-variants";

import { IconType, CTALink, CTALinkProps } from "@gc-digital-talent/ui";

const list = tv({
  base: "flex flex-wrap justify-center gap-3",
  variants: {
    centered: {
      true: "",
      false: "xs:justify-start",
    },
  },
});

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
  <ul className={list({ centered })}>
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
