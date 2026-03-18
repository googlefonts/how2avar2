#!/usr/bin/env bash
# [MISE] description="Clean git submodule"
# [USAGE] arg "[repo-url]" help="Repository url"

set -euo pipefail


if [[ -n "${usage_repo_url:-}" ]]; then
    SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
    # shellcheck source=mise/utilities/git.submodule.path.sh
    source "$SCRIPT_DIR/../utilities/git.submodule.path.sh"

    repo_url="${usage_repo_url?}"
    repo_path="$(get_submodule_path "$repo_url")"

    echo "$repo_path"

    git -C "$repo_path" clean -fdx
    git -C "$repo_path" reset --hard
else
    git submodule foreach --recursive 'git clean -fdx && git reset --hard'
fi
