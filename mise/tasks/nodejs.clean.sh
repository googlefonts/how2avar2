#!/usr/bin/env bash
# [MISE] description="Clean all ignored JavaScript files"
# [MISE] flag "-s --submodules" help="Include git submodules"

set -euo pipefail

include_submodules="${usage_submodules:-}"

find_args=()
if [[ -z "$include_submodules" ]]; then
    find_args+=("-not" "-path" "*/submodules/*")
fi

# delete all nested node_modules https://stackoverflow.com/a/43561012
find . -name 'node_modules' -type d "${find_args[@]}" -prune -exec rm -rf '{}' +
# multiple names https://unix.stackexchange.com/a/102203
find . '(' -name 'package-lock.json' -o -name 'yarn.lock' -o -name 'pnpm-lock.yaml' ')' -type f "${find_args[@]}" -prune -exec rm -rf '{}' +
