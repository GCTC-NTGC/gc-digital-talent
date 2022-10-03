# tc-report
A web version of the Talent Cloud results report, and some other static content.

This project is built with [Jekyll](https://jekyllrb.com/). The `/_site` folder contains the generated output.

If you have Docker installed, you can rebuild the site with
```
docker run --rm --volume="${PWD}:/srv/jekyll" -it jekyll/jekyll jekyll build
```
