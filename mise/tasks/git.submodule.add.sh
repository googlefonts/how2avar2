#!/usr/bin/env bash
# [MISE] description="Add git submodule"
# [USAGE] arg "<repo-url>" help="Repository url"

set -euo pipefail

SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
# shellcheck source=mise/utilities/git.submodule.path.sh
source "$SCRIPT_DIR/../utilities/git.submodule.path.sh"

repo_url="${usage_repo_url?}"
repo_path="$(get_submodule_path "$repo_url")"

git submodule add --depth 1 -- "$repo_url" "$repo_path"
git config --file .gitmodules "submodule.$repo_path.shallow" true
git add .gitmodules
