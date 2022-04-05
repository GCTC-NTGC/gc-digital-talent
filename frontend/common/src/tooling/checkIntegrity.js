/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require("fs");
const yargs = require("yargs");

const { argv } = yargs(process.argv.slice(2))
  .option("lock-file", {
    demandOption: true,
    describe: "path to package-lock.json file",
    string: true,
  })
  .option("allow", {
    demandOption: false,
    describe: "Package names on which to allow missing integrity values",
    string: true,
    array: true,
  })
  .help();

const countMissingIntegrityValues = (dependencies) =>
  Object.entries(dependencies).reduce(
    (previousCount, [packageName, packageProperties]) => {
      let missingIntegrityCount = 0;
      if (!packageProperties.integrity && argv.allow.indexOf(packageName) < 0) {
        console.log(`Package ${packageName} is missing the integrity`);
        missingIntegrityCount += 1;
      }
      if (packageProperties.dependencies) {
        missingIntegrityCount += countMissingIntegrityValues(
          packageProperties.dependencies,
        );
      }

      return previousCount + missingIntegrityCount;
    },
    0,
  );

console.log("Checking lock file integrity");
const lockObj = JSON.parse(fs.readFileSync(argv["lock-file"]));

const missingIntegrityCount = countMissingIntegrityValues(lockObj.dependencies);

console.log(`${missingIntegrityCount} dependencies are missing the integrity`);
