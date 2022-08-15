# Translation

The application is being designed and written in English and simultaneously being translated to French.  As pages are created, updated, and corrected a translation process is periodically performed to bring the French text up to date.  This document describes how that translation process is performed.

## Tools

The common subproject contains a script (`src/tooling/checkIntl.js`) to help manage the react-intl translations files. It has been written to run without any dependencies or compilation. It is expected to be used along with the [formatjs cli](https://formatjs.io/docs/tooling/cli).

### Directions
The checkIntl script can be run with different flags and options. For more details on how individual options work, see the checkIntl file itself. In practice, it is easiest to save the commands, with options included, as **package.json** scripts.

Note: each subproject using react-intl (e.g. admin, common, talentsearch, etc.) requires its own set of commands, and must be managed separately.

For example, to ensure translations in the admin project are up to date:
1. Run `npm run intl-extract` in the project you are managing (in this case, admin).
2. Run `npm run check-intl-admin` (from the /frontend/common folder). This generates a **untranslated.json** file in the admin project's lang folder.
3. Send **untranslated.json** for translation.  Refer to the instructions in the next section.
4. Save the translated version which comes back as **newTranslations.json** in the same lang folder.
5. Run `npm run check-intl-admin-merge` (again from the /frontend/common folder).
6. If you see any warnings about untranslated entries which simply match in English and French, add the key to the array in **whitelist.json** and repeat step 4.
7. Run `npm run intl-compile` in the /frontend/admin folder.

### On source control
Only **fr.json** and **whitelist.json** need to be checked into source control. The other files created during this process are generated as needed or only used to communicate with translators, should be added to .gitignore, and may be deleted after use.

## Requesting Translation Services

It is recommended to rename each **untranslated.json** file to something like **admin-english-to-french.txt** before sending to better identify the files for the translators.  Here is a template that can be used to request translation services from your translation contact:

> Hi {translation contact},
> 
> Could I please ask for your help arranging another round of translations for our website? I've attached several files from the project which need English to French translation.  The process has not changed but could you please pass on these instructions?
> 
> Please update the files in-place without changing any of the structure and formatting. The random-looking IDs and brackets are important to us. Only the strings identified as `defaultMessage` need to be translated. The ones labelled `description` are to give context to the translators and do not need to be translated.
> 
> Some strings could have brace brackets inside them like `"Skill {skillId} not found."`. The words inside the brace brackets like `skillId` are parameter names and should not be translated.  Similarly, tags like `strong` in `"You're about to <strong>remove the following user:</strong>"` should not be translated.
> 
> Thanks for your help!
