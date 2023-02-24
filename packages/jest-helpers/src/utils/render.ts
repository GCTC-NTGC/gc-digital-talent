import { render, RenderOptions } from "@testing-library/react";

import Providers from "../components/Providers";

const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): ReturnType<typeof render> => render(ui, { wrapper: Providers, ...options });

export default renderWithProviders;
