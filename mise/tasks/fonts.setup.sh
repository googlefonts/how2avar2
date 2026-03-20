#!/usr/bin/env bash
# [MISE] description="Install Python font dependencies"
# [MISE] sources=["pyproject.toml", "uv.lock"]

if [ ! -d .venv ]; then
  uv venv
fi

uv sync
