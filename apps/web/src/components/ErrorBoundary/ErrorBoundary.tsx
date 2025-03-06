import { Component, ErrorInfo, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { defaultLogger } from "@gc-digital-talent/logger";
import { errorMessages } from "@gc-digital-talent/i18n";

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    defaultLogger.error(JSON.stringify({ error, errorInfo }));
  }

  public render() {
    const { state, props } = this;

    if (state.hasError) {
      return (
        props.fallback ?? (
          <div
            data-h2-text-align="base(center)"
            data-h2-font-size="base:children[p](h5)"
            data-h2-margin="base(x2 0)"
          >
            <FormattedMessage
              tagName="p"
              {...errorMessages.unknownErrorRequestErrorTitle}
            />
          </div>
        )
      );
    }

    return props.children;
  }
}

export default ErrorBoundary;
