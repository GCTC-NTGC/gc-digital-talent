# tc-report

A web version of the Talent Cloud results report, and some other static content.

This project is built with [Jekyll](https://jekyllrb.com/). The `/_site` folder contains the generated output.

If you have Docker installed, you can rebuild the site with

```
docker run --rm --volume="${PWD}:/srv/jekyll" -it jekyll/jekyll jekyll build
```

A branch `_site` exists which contains only the content of the `/_site` folder, created with the command `git subtree split --prefix _site -b _site`

For more info on `git subtree`, check out the following links:

-   https://gist.github.com/SKempin/b7857a6ff6bddb05717cc17a44091202
-   https://www.atlassian.com/git/tutorials/git-subtree
-   https://jrsmith3.github.io/merging-a-subdirectory-from-another-repo-via-git-subtree.html
