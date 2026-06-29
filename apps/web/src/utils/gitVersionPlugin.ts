import childProcess from "node:child_process";

export const gitVersionPlugin = () => {
  const execGit = (cmd: string) => {
    try {
      return childProcess
        .execSync(`git ${cmd}`, { stdio: "pipe", timeout: 2000 })
        .toString()
        .trim();
    } catch {
      return null;
    }
  };

  return {
    name: "gc-git-version",
    config: () => {
      const version = execGit("describe --abbrev=0");
      const hash = execGit("rev-parse --short HEAD");

      return {
        define: {
          VERSION: JSON.stringify(version ?? "0.0.0"),
          COMMIT_HASH: JSON.stringify(hash ?? "unknown"),
        },
      };
    },
  };
};
