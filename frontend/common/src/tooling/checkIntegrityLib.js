/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

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
  if (metadata.length < 2) return false; // malformed integrity
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

const countInvalidIntegrityValues = (packages, allowedPackages = []) =>
  Object.entries(packages).reduce(
    (previousCount, [packageName, packageProperties]) => {
      if (!packageName) return previousCount; // no integrity on root package
      if (packageProperties.link) return previousCount; // no integrity on symlinked packages

      let invalidIntegrityCount = 0;

      // test if package has an integrity value
      if (
        !packageProperties.integrity &&
        allowedPackages.indexOf(packageName) < 0
      ) {
        console.error(`Package ${packageName} is missing the integrity`);
        invalidIntegrityCount += 1;
      }

      // test if package integrity is a valid hash
      if (
        packageProperties.integrity &&
        !isValidIntegrity(packageProperties.integrity)
      ) {
        console.error(
          `Package ${packageName} has the malformed integrity value ${packageProperties.integrity}`,
        );
        invalidIntegrityCount += 1;
      }
      return previousCount + invalidIntegrityCount;
    },
    0,
  );

module.exports = {
  base64Decode,
  isValidIntegrity,
  countInvalidIntegrityValues,
};
