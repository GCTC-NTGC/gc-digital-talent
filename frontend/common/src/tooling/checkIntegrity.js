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

// https://stackoverflow.com/a/55910865
const base64Decode = (encodedString) => {
  const buff = Buffer.from(encodedString, "base64");
  const text = buff.toString("hex");
  return text;
};

// Regular expressions to check for the right number of hex digits in hash
const sha1RegExp = /^[a-f0-9]{40}$/i;
const sha256RegExp = /^[a-f0-9]{64}$/i;
const sha384RegExp = /^[a-f0-9]{96}$/i;
const sha512RegExp = /^[a-f0-9]{128}$/i;

const isValidIntegrity = (integrity) => {
  const metadata = integrity.split("-");
  const algo = metadata[0];
  const digestHex = base64Decode(metadata[1]);
  switch (algo) {
    case "sha1":
      return sha1RegExp.test(digestHex); // may want deprecate these at some point https://w3c.github.io/webappsec-subresource-integrity/#hash-functions
    case "sha256":
      return sha256RegExp.test(digestHex);
    case "sha384":
      return sha384RegExp.test(digestHex);
    case "sha512":
      return sha512RegExp.test(digestHex);
    default:
      return false; // unknown algorithm
  }
};

const countInvalidIntegrityValues = (dependencies) =>
  Object.entries(dependencies).reduce(
    (previousCount, [packageName, packageProperties]) => {
      let invalidIntegrityCount = 0;

      // test if package has an integrity value
      if (!packageProperties.integrity && argv.allow.indexOf(packageName) < 0) {
        console.log(`Package ${packageName} is missing the integrity`);
        invalidIntegrityCount += 1;
      }

      // test if package integrity is a valid hash
      if (
        packageProperties.integrity &&
        !isValidIntegrity(packageProperties.integrity)
      ) {
        console.log(
          `Package ${packageName} has the malformed integrity value ${packageProperties.integrity}`,
        );
        invalidIntegrityCount += 1;
      }

      // recurse if this package has its own dependencies
      if (packageProperties.dependencies) {
        invalidIntegrityCount += countInvalidIntegrityValues(
          packageProperties.dependencies,
        );
      }

      return previousCount + invalidIntegrityCount;
    },
    0,
  );

console.log("Checking lock file integrity");
const lockObj = JSON.parse(fs.readFileSync(argv["lock-file"]));

const invalidIntegrityCount = countInvalidIntegrityValues(lockObj.dependencies);

if (invalidIntegrityCount > 0) {
  console.log(
    `${invalidIntegrityCount} dependencies have an invalid integrity value`,
  );
  process.exit(1); // error exit code
}

console.log("Check complete");
process.exit();
