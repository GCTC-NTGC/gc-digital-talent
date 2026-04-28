import { useLayoutEffect } from "react";
import type { Decorator } from "@storybook/react-vite";
import { useParameter } from "storybook/preview-api";

export type RuntimeVariables = Record<string, string>;

interface HasServerConfig {
  __SERVER_CONFIG__?: Map<string, string>;
}

/**
 * Access the window object with the server config type
 */
const getWindowWithConfig = (): HasServerConfig | undefined => {
  if (typeof window === "undefined") return undefined;
  return window as unknown as HasServerConfig;
};

/**
 * Get the server config from window, initializing if needed
 */
const getServerConfig = (): Map<string, string> => {
  const windowWithConfig = getWindowWithConfig();
  if (!windowWithConfig) {
    return new Map<string, string>();
  }

  // eslint-disable-next-line no-underscore-dangle
  windowWithConfig.__SERVER_CONFIG__ ??= new Map<string, string>();

  // eslint-disable-next-line no-underscore-dangle
  return windowWithConfig.__SERVER_CONFIG__;
};

/**
 * A Storybook decorator that provides runtime variables for stories.
 *
 * This allows stories to use `getRuntimeVariable` from `@gc-digital-talent/env`
 * by configuring the `runtimeVariables` parameter.
 *
 * @example
 * ```tsx
 * const meta = {
 *   title: 'Components/MyComponent',
 *   component: MyComponent,
 *   parameters: {
 *     runtimeVariables: {
 *       LOG_CONSOLE_LEVEL: "Debug",
 *       OAUTH_LOGOUT_URI: "https://example.com/logout",
 *     },
 *   },
 * };
 * ```
 */
const RuntimeVariableDecorator: Decorator = (Story) => {
  const runtimeVariables = useParameter<RuntimeVariables | undefined>(
    "runtimeVariables",
    undefined,
  );

  useLayoutEffect(() => {
    if (!runtimeVariables) {
      return undefined;
    }

    const serverConfig = getServerConfig();

    // Save the original values before overwriting
    const originalValues = new Map<string, string | undefined>();
    Object.keys(runtimeVariables).forEach((key) => {
      originalValues.set(key, serverConfig.get(key));
    });

    // Set the runtime variables before the story renders
    Object.entries(runtimeVariables).forEach(([key, value]) => {
      serverConfig.set(key, value);
    });

    // Cleanup: only restore values that this decorator instance still owns.
    // If another mounted story has since changed the same key, leave it alone.
    return () => {
      Object.entries(runtimeVariables).forEach(([key, value]) => {
        if (serverConfig.get(key) !== value) {
          return;
        }
        const originalValue = originalValues.get(key);
        if (originalValue !== undefined) {
          serverConfig.set(key, originalValue);
        } else {
          serverConfig.delete(key);
        }
      });
    };
  }, [runtimeVariables]);

  return <Story />;
};

export default RuntimeVariableDecorator;
