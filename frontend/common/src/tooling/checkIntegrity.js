/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require("fs");
const yargs = require("yargs");
const { countInvalidIntegrityValues } = require("./checkIntegrityLib");

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

console.log("Checking lock file integrity");
const lockObj = JSON.parse(fs.readFileSync(argv["lock-file"]));

const invalidIntegrityCount = countInvalidIntegrityValues(
  lockObj.packages,
  argv.allow,
);

if (invalidIntegrityCount > 0) {
  console.log(
    `${invalidIntegrityCount} packages have an invalid integrity value`,
  );
  process.exit(1); // error exit code
}

console.log("Check complete");
process.exit();
