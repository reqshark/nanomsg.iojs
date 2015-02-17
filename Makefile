.PHONY: clean check test perf bench full

RUN = node test | node_modules/.bin/tap-difflet

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
	node perf/local_lat.js tcp://127.0.0.1:5555 1 100000& node perf/remote_lat.js tcp://127.0.0.1:5555 1 100000
	node perf/local_thr.js tcp://127.0.0.1:5556 1 100000& node perf/remote_thr.js tcp://127.0.0.1:5556 1 100000

bench:
	node perf/local_lat.js tcp://127.0.0.1:5555 10 1000& node perf/remote_lat.js tcp://127.0.0.1:5555 10 1000
	node perf/local_thr.js tcp://127.0.0.1:5556 10 100000& node perf/remote_thr.js tcp://127.0.0.1:5556 10 100000

full:
	rm -fr build
	rm -rf node_modules
	npm i
	$(RUN)
