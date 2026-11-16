---
date: 2026-10-26
skill: design-studio
project: zh-architecture-doc-html
type: missing
severity: minor
---

## What happened

The user asked for a LAN link to the options board so colleagues could open it. Nothing in the skill covers sharing a board. `python3 -m http.server` broke under the board's load. The board fires about 50 image and video requests at once, Python's default listen backlog is 5, and colleagues saw broken images and stalled videos (ERR_CONNECTION_RESET / ERR_SOCKET_NOT_CONNECTED). It also lacks Range support, which Safari and iOS need to play mp4. I wrote a small server with:
- a threaded server with `request_queue_size = 128`
- HTTP/1.1 keep-alive
- byte-range (206) responses
- directory listing disabled
- binding to the LAN interface's address

After that, every image and video loaded.

## Expected / suggestion

A `scripts/serve_board.py` beside capture.mjs (args: directory, bind address, port) with the settings above. Add a line in references/process/directions.md (board section) saying:
- how to share a board on a LAN
- that the plain `http.server` is not enough for a media-heavy board
- that the link lives only as long as the serving process does
- that a direction using WebGPU (or any other secure-context API) needs https on a LAN address. The server takes an optional certificate and key for that.
