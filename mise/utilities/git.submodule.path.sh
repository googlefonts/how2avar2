#!/usr/bin/env bash
set -euo pipefail

get_submodule_path() {
    submodule_path="$1"
    # remove ssh formatting
    submodule_path="${submodule_path#git@github.com:}"
    submodule_path="${submodule_path%.git}"
    # remove https formatting
    submodule_path="${submodule_path#https://github.com/}"
    submodule_path="${submodule_path%/}"
    # print the result
    echo "submodules/$submodule_path"
}
