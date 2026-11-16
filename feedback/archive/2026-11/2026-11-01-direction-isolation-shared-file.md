---
date: 2026-11-01
skill: design-studio
project: zh-macos-native-app
type: friction
severity: minor
---

## What happened

The round's direction coordinates were kept in one shared file, and one isolated direction agent
read it (all four theses) to write its thumbnail sentence; another opened host source files to check
shortcuts. The leak was disclosed on the board, but isolation depended on the agents' restraint.

## Expected / suggestion

In `references/process/directions.md`, hand each direction agent only its own coordinates (one file
per direction, or inline in the packet) and say which host files it may read.
