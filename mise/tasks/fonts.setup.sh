#!/usr/bin/env bash
# [MISE] sources=["pyproject.toml", "uv.lock"]

if [ ! -d .venv ]; then
  uv venv
fi

uv sync
