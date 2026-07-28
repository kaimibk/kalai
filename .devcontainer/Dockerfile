FROM mcr.microsoft.com/devcontainers/javascript-node:20-bookworm

# Install additional OS packages if needed
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl git ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set default user
USER node
