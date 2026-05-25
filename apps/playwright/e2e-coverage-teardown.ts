import MCR from "monocart-coverage-reports";

export default async () => {
  const mcr = MCR({
    name: "E2E Coverage",
    outputDir: "./coverage",
    reports: [["lcovonly", { file: "lcov.info" }]],
    entryFilter: { "**/node_modules/**": false, "**/*": true },
    sourceFilter: (sourcePath: string) =>
      /(apps\/web|packages\/.+)\/src\//.test(sourcePath),
  });
  await mcr.generate();
};
