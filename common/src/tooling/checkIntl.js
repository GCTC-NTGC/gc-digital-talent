/* eslint-disable no-console */
import yargs from "yargs";
import fs from "fs/promises";

const { argv } = yargs(process.argv.slice(2))
  .option("en", {
    demandOption: true,
    describe: "path to en.json file extracted by Format.js",
    string: true,
  })
  .option("fr", {
    demandOption: true,
    describe: "path to fr.json with same format as en.json",
    string: true,
  })
  .option("output-untranslated", {
    alias: "o",
    describe: "output all untranslated entries to a json file at this path",
    string: true,
  })
  .option("merge-fr", {
    alias: "m",
    describe:
      "a path to a json file of new translations which should be merged with fr.json before checking anything",
    string: true,
  })
  .option("rm-orphaned", {
    alias: "r",
    describe: "delete entries in fr.json file which don't appear in en.json",
    boolean: true,
  })
  .option("whitelist", {
    alias: "w",
    describe:
      "path to json file containing an array of keys which are expected to be identical in fr and en",
    string: true,
  })
  .help();

const en = await fs.readFile(argv.en).then(JSON.parse);
const frOriginal = await fs.readFile(argv.fr).then(JSON.parse);
const frNew = argv["merge-fr"]
  ? await fs.readFile(argv["merge-fr"]).then(JSON.parse)
  : {};
const fr = { ...frOriginal, ...frNew };
const whitelist = argv.whitelist
  ? await fs.readFile(argv.whitelist).then(JSON.parse)
  : [];
// Used to track changes that may need to be made to fr.json, so we only update it once.
let outputFr = null;

const saveJson = async (file, obj) =>
  fs.writeFile(file, JSON.stringify(obj, null, 2));

if (Object.keys(frNew).length > 0) {
  outputFr = fr;
  console.log(`Entries from ${argv["merge-fr"]} merged into ${argv.fr}`);
}

const transform = (obj, predicate) => {
  return Object.keys(obj).reduce((memo, key) => {
    if (predicate(obj[key], key)) {
      // eslint-disable-next-line no-param-reassign
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};
const omit = (obj, items) =>
  transform(obj, (value, key) => !items.includes(key));
const pick = (obj, items) =>
  transform(obj, (value, key) => items.includes(key));

const enKeys = Object.keys(en);
const missingKeys = enKeys.filter((enKey) => {
  return fr[enKey] === undefined;
});
const untranslatedKeys = enKeys.filter(
  (enKey) =>
    fr[enKey]?.defaultMessage === en[enKey].defaultMessage &&
    !whitelist.includes(enKey),
);

if (missingKeys.length > 0) {
  const missing = pick(en, missingKeys);
  console.error("These values are missing translations:", missing);
}
if (untranslatedKeys.length > 0) {
  const untranslated = pick(en, untranslatedKeys);
  console.error("These values are identical in en and fr:", untranslated);
}

const orphanedKeys = Object.keys(fr).filter((frKey) => en[frKey] === undefined);
const orphaned = pick(fr, orphanedKeys);

if (
  argv["output-untranslated"] &&
  (untranslatedKeys.length > 0 || missingKeys.length > 0)
) {
  saveJson(
    argv["output-untranslated"],
    pick(en, [...missingKeys, ...untranslatedKeys]),
  );
  console.warn(`Output untranslated entries to ${argv["output-untranslated"]}`);
}

if (argv["rm-orphaned"] && orphanedKeys.length > 0) {
  outputFr = omit(outputFr !== null ? outputFr : fr, orphanedKeys);
  console.warn(
    "These values were removed from fr as they are not in en:",
    orphaned,
  );
} else if (orphanedKeys.length > 0) {
  console.error("These values are present in fr but not in en:", orphaned);
}

if (outputFr !== null) {
  saveJson(argv.fr, outputFr);
}

if (
  missingKeys.length === 0 &&
  untranslatedKeys.length === 0 &&
  orphanedKeys.length === 0
) {
  console.log("Your translation files are ready to go!");
}
