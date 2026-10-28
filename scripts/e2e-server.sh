#!/bin/sh
set -eu

cleanup() {
    docker compose down --remove-orphans >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

# Start from a clean slate so tests never run against a stale image.
docker compose down --remove-orphans >/dev/null 2>&1 || true
docker compose up --build --remove-orphans
