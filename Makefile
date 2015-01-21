.PHONY: clean check test

TESTS = $(wildcard test/test.*.js)
MOCHA = node_modules/.bin/mocha
RUN = $(MOCHA) --expose-gc --slow 5000 --timeout 600000

ALL:
	npm i

check:
	$(RUN)

test:
	$(RUN)

clean:
	rm -fr build
	rm -rf node_modules
