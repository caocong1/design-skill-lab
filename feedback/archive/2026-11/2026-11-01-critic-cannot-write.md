---
date: 2026-11-01
skill: critique-design
project: zh-macos-native-app
type: friction
severity: minor
---

## What happened

In this host, critic subagents were refused file writes, so `report.md` could not be written by the
critic. Each time the critic returned the whole report in its reply and the author saved it
verbatim. One critic of three managed to write its acceptance report; two could not.

## Expected / suggestion

Make "return the complete report in the reply when the write is refused" part of the critic brief
template, and tell the author to save it unchanged; today only the author's improvised brief says so.
