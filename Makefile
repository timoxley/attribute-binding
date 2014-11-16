all: build.js
prepublish: all

start:
	cd test && beefy index.js:bundle.js

test: all
	browserify test/smokestack.js | smokestack | tap-spec

build.js: index.js
	6to5 index.js > build.js

.PHONY: prepublish pretest start test all
