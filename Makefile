.PHONY: dev start stop install check build preview db-start db-stop db-reset db-status

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

db-start:
	docker run --rm -v /:/host alpine sh -c "rm -rf /host/workspace/kalai && ln -s /mnt/host/c/Users/vereo/Documents/Projects/kalai /host/workspace/kalai" 2>/dev/null || true
	(docker run --rm -v $(PWD):/workspace alpine rm -rf /workspace/supabase/.temp 2>/dev/null || rm -rf supabase/.temp 2>/dev/null || true)
	SUPABASE_SERVICES_HOSTNAME=host.docker.internal npx supabase start --ignore-health-check && npm run db:env

db-stop:
	npx supabase stop --no-backup && (docker volume ls -q --filter name=supabase_db_ | xargs -r docker volume rm 2>/dev/null || true)

db-reset:
	SUPABASE_SERVICES_HOSTNAME=host.docker.internal npx supabase db reset && npm run db:env

db-status:
	npx supabase status

