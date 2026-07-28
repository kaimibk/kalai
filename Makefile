.PHONY: dev start stop install check build preview

# Default target
dev:
	npm run dev -- --host 0.0.0.0 --port 3000

start: dev

stop:
	fuser -k 3000/tcp || true

install:
	npm install

check:
	npm run check

build:
	npm run build

preview:
	npm run preview
