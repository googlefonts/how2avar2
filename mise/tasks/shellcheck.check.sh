#!/usr/bin/env bash
# [MISE] description="shellcheck all shell task files"
# [MISE] sources=["mise/tasks/*.sh"]

set -euo pipefail

while IFS= read -r -d '' file; do
    if [[ "$(head -n 1 "$file")" == "#!/usr/bin/env bash" ]]; then
        shellcheck -x "$file"
    fi
done < <(find "./mise/tasks" "./mise/utilities" -type f -name '*.sh' -print0)
