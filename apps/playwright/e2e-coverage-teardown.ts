import { CoverageReport } from "monocart-coverage-reports";

export default async () => {
  const cr = new CoverageReport({
    name: "E2E Coverage",
    outputDir: "./coverage",
    reports: [["lcovonly", { file: "lcov.info" }]],
    entryFilter: { "**/node_modules/**": false, "**/*": true },
    sourceFilter: (sourcePath: string) =>
      /(apps\/web|packages\/.+)\/src\//.test(sourcePath),
  });
  await cr.generate();
};
