<span>
    
environment-safe-template
=========================

This setup normalizes a **from source** usage for all environments ([node](https://nodejs.org/)/[browser](https://developer.mozilla.org/en-US/docs/Web/JavaScript)+[modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)/[commonjs](https://en.wikipedia.org/wiki/CommonJS)). It [babel]() compiles the commonjs files into `/dist` and it (from [jsdoc](https://jsdoc.app/)) compiles both docs (in `/docs`) and typescript types (alongside the source in `/src`).

It sets up a single test that is used in headless, browser and node modes, has a sane set of lint rules and husky bindings to make sure you:

1) don't have to do any of it manually
2) it all stays up to date
3) You write in a single format
4) The source you are writing is executable as-is in node + the browser
5) 1 file to rule them all

This allows you to use either source tree for compilation as well.

Requirements
------------

You need a copy of [`jq`](https://jqlang.github.io/jq/) installed in order to initialize

Usage
-----

[fork as a template in github]( https://docs.github.com/en/enterprise-server@2.22/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template ) then clone it locally

OR

use the [github cli](https://cli.github.com/) to create a template from the repo
```bash
    gh repo create --template="@environment-safe/template" <new-repo-name>
```

OR

Use degit to copy the repo with no history
```bash
    mkdir <new-repo-name>
    cd <new-repo-name>
    npx degit environment-safe/template
    git init
```

THEN

Once you've done that, change directories into the project directory and run `./initialize` which will configure your `package.json`, your `LICENSE` and your `README.md`(this file) and remove any artifacts as well as itself and stage the changes for commit.

LAST

When you commit, the rest of the artifacts will be generated and added to your commit.

When you come back this will all be gone. Good Luck!

Roadmap
-------

- [X] - submodule for minimal project footprint
- [ ] - support windows development
- [ ] - support multiple licenses
- [ ] - support electron
- [ ] - support cordova

</span>

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

