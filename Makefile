PROJECT_FILES := index.html manfest.webapp
BUILD_DIR := "build"

########################################################################################################################
KARMA := ./node_modules/karma-cli/bin/karma start test/config/karma.config.js
KARMAFLAGS := --single-run

WEBPACK := webpack
WEBPACKFLAGS := --config webpack.config.prod.js

########################################################################################################################
.PHONY: build test watch lint clean

build: test lint clean
	$(WEBPACK) $(WEBPACKFLAGS)

	@-for file in $(PROJECT_FILES); do \
		FILE_DIR=$$(dirname $$file); \
		mkdir -p "$(BUILD_DIR)/$$FILE_DIR"; \
		cp src/$$file "$(BUILD_DIR)/$$file"; \
	done;

	@echo "";
	@echo "Build success!";

test:
	$(KARMA) $(KARMAFLAGS)

watch:
	$(KARMA)

lint:
	./node_modules/eslint/bin/eslint.js src test

clean:
	-rm -r build
