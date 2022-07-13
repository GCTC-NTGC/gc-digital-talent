# TC-Report

This document provides context around the data in the `tc-report` subdirectory and help on how to update it.

## Source

The data in the `tc-report` directory is pulled from a separate repository: [`/GCTC-NTGC/tc-report`](https://github.com/GCTC-NTGC/tc-report). Therefore, the files in the `tc-report` directory of the `gc-digital-talent` repository __should never be directly edited__.

## Workflow

This section details the workflow for applying updates to the files in the `tc-report` directory.

### Step 1 - Apply the changes in the source repository

Follow the regular github process to apply the changes in the [`/GCTC-NTGC/tc-report`](https://github.com/GCTC-NTGC/tc-report) repository: 
1. Clone the repository to your workstation
2. Make a feature branch with your changes
3. Open a pull request
4. Have your feature branch merged into `main`

More information on how to work with the repository and the Jekyll site builder are in [`/GCTC-NTGC/tc-report#readme`](https://github.com/GCTC-NTGC/tc-report#readme).

### Step 2 - Apply your changes to the `_site` branch

The [`/GCTC-NTGC/tc-report`](https://github.com/GCTC-NTGC/tc-report) repository maintains a `_site` branch which contains only the generated files from the `_site` directory.  This provides an isolated view of __only the generated files__.
```
# Change into your cloned tc-report directory (wherever you have it)
cd ~/repos/tc-report

# Make (and checkout) a staging branch:
git checkout -b staging-branch origin/main

# Split out the `_site` branch: 
git subtree split -P _site -b _site

# Push the updated branch to github:
git push origin _site
```

You should be able to review that the `_site` branch on github now reflects the new changes.

### Step 3 - Pull the changes into the `gc-digital-talent` repo

Now the updated `_site` branch of `tc-report` can be pulled into the `tc-report` directory of the `gc-digital-talent` repo.

```
# Change into your cloned gc-digital-talent directory (wherever you have it)
cd ~/repos/gc-digital-talent

# Pull _site branch in
git subtree pull --prefix tc-report https://github.com/GCTC-NTGC/tc-report.git _site --squash
```
Now you can create a pull request for `gc-digital-talent` based on the pulled change.
