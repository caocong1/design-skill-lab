---
date: 2026-11-01
skill: implement-design
project: zh-macos-native-app
type: missing
severity: major
---

## What happened

Amends 2026-11-01-native-macos-capture.md. The "side-by-side copy with its own bundle id" used for
captures was made by copying the built app, changing `CFBundleIdentifier` and re-signing. The copy
kept the binary's build UUID (`LC_UUID`). macOS Local Network privacy identifies apps by that UUID, so
the shipping app's access was filed under the copy's bundle id: the owner turned Local Network on and
the shipping app stayed blocked (`nehelper` log: the release UUIDs cached under the copy's id; the
app's connections "Local network prohibited"). Two Xcode defaults made it worse: with
`ENABLE_DEBUG_DYLIB` the main executable of a Debug build is a stub that is the same in every build,
so every Debug flavor shares one UUID; and `xcodebuild` registers each build product with
LaunchServices, so stale copies under the shipping bundle id pile up.

## Expected / suggestion

In the native-desktop capture section: build the side-by-side copy from source with its own bundle id
(`xcodebuild … PRODUCT_BUNDLE_IDENTIFIER=<id>`, own derived data) and a unique build UUID (Debug:
`ENABLE_DEBUG_DYLIB = NO` and `-Xlinker -random_uuid`); never re-sign a copy under another bundle id;
check with `dwarfdump --uuid` that no two installed apps share a UUID; after installing, unregister the
build product (`lsregister -u`) so one copy per bundle id stays registered. Sources: Apple TN3178
(build UUID problems), TN3179 (local network privacy). Diagnose with
`/usr/bin/log show --predicate 'process == "nehelper"'`.
