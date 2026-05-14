# Quick Install and Development Setup
[default]
[private]
install-dev: install env multi-dev

[no-cd]
[private]
@sfw_wrap mode +command:
    if [ "{{ mode }}" = "safe" ] || [ "{{ mode }}" = "--safe" ]; then \
        sfw {{ command }}; \
    else \
        {{ command }}; \
    fi

alias i := install

# Install dependencies (protected)
[group('Bun Recipies')]
install mode="safe":
    @just sfw_wrap {{ mode }} "bun install"

alias up := update

# Update to latest dependencies (protected)
[group('Bun Recipies')]
[group('Featured')]
update mode="safe":
    @just sfw_wrap {{ mode }} bun update --latest

alias a := add

# Add a new package (protected)
[group('Bun Recipies')]
add PACKAGE mode="safe":
    @just sfw_wrap {{ mode }} "bun add {{ PACKAGE }}"

alias rm := remove

# Remove a package (protected)
[group('Bun Recipies')]
remove PACKAGE mode="safe":
    @just sfw_wrap {{ mode }} "bun remove {{ PACKAGE }}"

# Start Development server
[group('Featured')]
[group('Web')]
dev port="3000":
    @ENVIRONMENT="$({ grep -E '^ENVIRONMENT=' .env.local 2>/dev/null | tail -n 1 | cut -d= -f2-; } 2>/dev/null)"; \
    if [ "${ENVIRONMENT:-development}" = "development" ]; then \
        bunx --bun vite dev --port {{ port }}; \
    else \
        wrangler dev --port {{ port }}; \
    fi

# Run web dev + Convex dev together
[private]
multi-dev:
    @if command -v tmux &>/dev/null; then \
        if [ -n "$$TMUX" ]; then \
            if tmux list-windows -F '#{window_name}' | grep -qx 'PRISM-DEV'; then \
                tmux select-window -t PRISM-DEV; \
                tmux send-keys -t PRISM-DEV:0.0 C-c; \
                tmux send-keys -t PRISM-DEV:0.1 C-c; \
                tmux send-keys -t PRISM-DEV:0.0 'just dev' Enter; \
                tmux send-keys -t PRISM-DEV:0.1 'just convex-dev' Enter; \
            else \
                tmux new-window -n PRISM-DEV 'just dev'; \
                tmux split-window -h -t PRISM-DEV 'just convex-dev'; \
                tmux select-window -t PRISM-DEV; \
            fi; \
        else \
            SESSION="prism-$${PWD##*/}"; \
            tmux new-session -d -s "$$SESSION" -n PRISM-DEV 'just dev'; \
            tmux split-window -h -t "$$SESSION":PRISM-DEV 'just convex-dev'; \
            tmux attach -t "$$SESSION"; \
        fi; \
    else \
        bunx --bun concurrently "just dev" "just convex-dev"; \
    fi

# Run type checking and linting
[group('Code Quality')]
check:
    biome check

# Run code formatting
[group('Code Quality')]
format +mode="write":
    @if [ "{{ mode }}" = "write" ]; then \
        biome format --write; \
    elif [ "{{ mode }}" = "check" ]; then \
        biome format; \
    else \
        biome format {{ mode }}; \
    fi

# Run linting
[group('Code Quality')]
lint:
    biome lint

# Run Code Quality Suite
[group('Code Quality')]
[group('Featured')]
quality: format lint

# Run tests with Vitest - Note: there are currently no tests
[group('Testing')]
vitest:
    vitest run

# Run Vite build
[group('Testing')]
[group('Web')]
build:
    bunx --bun vite build;

# Start build in preview mode - Automatically builds the server
[group('Testing')]
[group('Web')]
preview: build
    @ENVIRONMENT="$({ grep -E '^ENVIRONMENT=' .env.local 2>/dev/null | tail -n 1 | cut -d= -f2-; } 2>/dev/null)"; \
    if [ "${ENVIRONMENT:-development}" = "development" ]; then \
      bunx --bun vite preview; \
    else \
      wrangler preview; \
    fi

# Convex development server
[group('Convex')]
convex-dev:
    bunx --bun convex dev

# Convex deploy
[group('Convex')]
convex-deploy:
    bunx --bun convex deploy

# Convex code generation
[group('Convex')]
convex-codegen:
    bunx --bun convex codegen

[group('Tools')]
env env="development":
    @if grep -q '^ENVIRONMENT=' .env.local 2>/dev/null; then \
        sed -i 's/^ENVIRONMENT=.*/ENVIRONMENT={{ env }}/' .env.local; \
    else \
        echo 'ENVIRONMENT={{ env }}' >> .env.local; \
    fi
