import yargs from "yargs";
import fs from "fs/promises";

const { argv } = yargs(process.argv.slice(2))
  .option("en", {
    demandOption: true,
    describe: "path to en.json file extracted by Format.js",
  })
  .option("fr", {
    demandOption: true,
    describe: "path to fr.json with same format as en.json",
  })
  //   .boolean("rm-orphaned", {
  //     alias: "r",
  //     describe: "delete entries in fr.json file which don't appear in en.json",
  //   })
  .option("whitelist", {
    alias: "w",
    describe:
      "path to json file containing an array of keys which are expected to be identical in fr and en",
  })
  .help();

const en = await fs.readFile(argv.en).then(JSON.parse);
const fr = await fs.readFile(argv.fr).then(JSON.parse);
const whitelist = argv.whitelist
  ? await fs.readFile(argv.whitelist).then(JSON.parse)
  : [];

const reduceEn = (newEn, enKey) => {
  newEn[enKey] = en[enKey];
  return newEn;
};
const reduceFr = (newFr, frKey) => {
  newFr[frKey] = fr[frKey];
  return newFr;
};

const enKeys = Object.keys(en);

const missing = enKeys
  .filter((enKey) => {
    return fr[enKey] === undefined;
  })
  .reduce(reduceEn, {});

const untranslated = enKeys
  .filter(
    (enKey) =>
      fr[enKey]?.defaultMessage === en[enKey].defaultMessage &&
      !whitelist.includes(enKey),
  )
  .reduce(reduceEn, {});

const orphaned = Object.keys(fr)
  .filter((frKey) => en[frKey] === undefined)
  .reduce(reduceFr, {});

console.log("These values are missing translations:", missing);
console.log("These values are identical in en and fr:", untranslated);
console.log("These values are present in fr but not in en:", orphaned);
