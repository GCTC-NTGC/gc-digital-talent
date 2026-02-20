import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  buildDirectory: "dist",
  ssr: false,
  future: {
    v8_middleware: true,
  },
} satisfies Config;
