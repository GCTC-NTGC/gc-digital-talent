import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { IntlConfig } from "react-intl";

import Providers from "../components/Providers";

interface Options extends Omit<RenderOptions, "wrapper"> {
  richTextElements?: IntlConfig["defaultRichTextElements"];
}

const renderWithProviders = (
  ui: ReactElement,
  opts: Options = {},
): ReturnType<typeof render> => {
  const { richTextElements, ...options } = opts;
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Providers richTextElements={richTextElements}>{children}</Providers>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

export default renderWithProviders;
