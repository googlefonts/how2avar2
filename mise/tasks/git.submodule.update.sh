#!/usr/bin/env bash
# [MISE] description="Update git submodule(s) to the latest remote commits"
# [USAGE] arg "[repo-url]" help="Repository url (optional)"

set -euo pipefail

if [[ -n "${usage_repo_url:-}" ]]; then
    SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
    # shellcheck source=mise/utilities/git.submodule.path.sh
    source "$SCRIPT_DIR/../utilities/git.submodule.path.sh"

    repo_url="${usage_repo_url?}"
    repo_path="$(get_submodule_path "$repo_url")"

    git submodule update --remote --recursive --recommend-shallow --progress "$repo_path"
else
    git submodule update --remote --recursive --recommend-shallow --progress
fi
