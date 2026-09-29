---
date: 2026-09-29
skill: critique-design
project: zh-media-web
type: friction
severity: minor
---

## What happened
templates/critic-brief.md tells the fresh critic subagent to write report.md into the critique folder. In this host the subagent's write of the report was refused ("subagents must return the report as text"); it saved the evidence crops but returned the report inline, and the author had to extract and save it.

## Expected / suggestion
The brief's Return section could say: if writing the report file is refused, return the full report in a fenced block at the end of the reply so the author saves it unchanged.
