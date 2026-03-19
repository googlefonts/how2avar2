#!/usr/bin/env bash
# [MISE] description="Clean all ignored Python files"
# [MISE] flag "-s --submodules" help="Include git submodules"

set -euo pipefail

include_submodules="${usage_submodules:-}"

find_args=()
if [[ -z "$include_submodules" ]]; then
    find_args+=("-not" "-path" "*/submodules/*")
fi

find . -name '.venv' -type d "${find_args[@]}" -prune -exec rm -rf '{}' +

find . -name '*.pyc' -type f "${find_args[@]}" -prune -exec rm -rf '{}' +
