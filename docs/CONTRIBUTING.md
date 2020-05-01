# Contributing to Gyromina

First off, if you're reading this file, I assume you want to help me improve Gyromina. Thanks for doing that, I really appreciate it!

Secondly, please make sure you've read through the code of conduct under [**docs/CODE_OF_CONDUCT.md**](https://github.com/Lowie375/Gyromina/blob/master/docs/CODE_OF_CONDUCT.md) before contributing.

## General Notes

### If you are reporting a bug:
* Check the GitHib [issues tab](https://github.com/Lowie375/Gyromina/issues) to see if your bug has already been reported
* If it has not been reported, create a new issue using the primary issue template under [**.github/ISSUE_TEMPLATE/bug_report.md**](https://github.com/Lowie375/Gyromina/blob/master/.github/ISSUE_TEMPLATE/bug_report.md)

### If you are contributing code or patching a bug:
* Open a new GitHub pull request
* Add a title that summarizes the pull request and list changes in the pull request's description
* Preferably, have code in your pull request follow Gyromina's main conventions (listed [below](https://github.com/Lowie375/Gyromina/new/master#code-conventions)\)

### If you are requesting a feature:
* Check the GitHib [issues tab](https://github.com/Lowie375/Gyromina/issues) to see if that feature has already been requested
* If it has not been requested, create a new issue using the primary feature request template under [**.github/ISSUE_TEMPLATE/feature_request.md**](https://github.com/Lowie375/Gyromina/blob/master/.github/ISSUE_TEMPLATE/feature_request.md)

## Code Conventions
These are the main conventions I've tried to follow within Gyromina's code. You should be able to get the gist of them (along with other minor conventions) once you start reading through some of the code.
* Indent using double spaces (soft tabs)
* Put spaces after list items, parameters, and operators (`[x, y, z]` over `[x,y,z]`, `c += 5` over `c+=5`)
* No spaces inside single line blocks (`if(foo == true) {return bar;}` over `if(foo == true) { return bar; }`)
* Make things look nice! Add whitespace between large segments of code and include comments wherever you see fit. This is an open source project, so keeping things clean and easy to read helps everyone. Plus, I'm still learning as I go along, so adding comments that show what certain bits of code do helps me learn new methods and problem-solving approaches

## Other Notes
If you have contributed or tested code:
* Feel free to add yourself to the list of contributors or testers in [**package.json**](https://github.com/Lowie375/Gyromina/blob/master/package.json), if you'd like to
  * **Contributors**: Add your Discord tag to `contributors[]` and your Discord user ID to `contributorIDs[]`, preferably at the same array index
  * **Testers**: Add your Discord tag to `testers[]` and your Discord user ID to `testerIDs[]`, preferably at the same array index
* I will add you to the list of contributors or testers in the README file once your contributions have been pushed, unless you specify otherwise
