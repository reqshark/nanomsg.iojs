.PHONY: clean check test perf

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

perf:
	#node perf/local_lat.js tcp://127.0.0.1:5555 1 100000& node perf/remote_lat.js tcp://127.0.0.1:5555 1 100000
	node perf/local_thr.js tcp://127.0.0.1:5556 1 100000& node perf/remote_thr.js tcp://127.0.0.1:5556 1 100000
