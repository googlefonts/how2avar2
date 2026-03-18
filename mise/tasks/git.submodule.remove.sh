#!/usr/bin/env bash
# [MISE] description="Remove git submodule"
# [USAGE] arg "<repo-url>" help="Repository url"

set -euo pipefail

SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
# shellcheck source=mise/utilities/git.submodule.path.sh
source "$SCRIPT_DIR/../utilities/git.submodule.path.sh"

repo_url="${usage_repo_url?}"
repo_path="$(get_submodule_path "$repo_url")"

git rm -rf "$repo_path"
git config --remove-section "submodule.$repo_path"
rm -rf ".git/modules/$repo_path"
