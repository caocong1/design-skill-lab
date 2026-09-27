# Apple HIG: Bars (Tab bars, Toolbars and navigation bars, Sidebars) for iOS, iPadOS and macOS 26–27
- id: apple-hig-bars · url: https://developer.apple.com/design/human-interface-guidelines/tab-bars · fetched: 2026-09-27 · method: json-api + fetch
- review_by: 2026-12-26 · licence note: paraphrased digest, not a mirror
> 中文导语：iOS 26 起，标签栏悬浮在内容上方（Liquid Glass），可以在滚动时缩小，可以带附件，搜索可以作为单独一个标签放在最右侧。工具栏按功能分组，只允许一个 `.prominent` 主操作。独立的"导航栏"页面已并入 Toolbars。27 系列又加了几样：prominent 标签、工具栏可见优先级、iPhone 也能用侧边栏，以及折叠屏 iPhone Duo 把各种栏移到屏幕侧边。画移动端导航前先读这份。

Read (2026-09-27; HIG via `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`): tab-bars, toolbars,
sidebars, search-fields, icons, the-menu-bar, designing-for-iphone-duo, scroll-views. `navigation-bars.json` returns **404**. Developer docs:
`/documentation/technologyoverviews/adopting-liquid-glass`, SwiftUI `TabBarMinimizeBehavior`, `TabViewBottomAccessoryPlacement`, `TabRole/prominent`,
`ToolbarItemVisibilityPriority`, `ToolbarOverflowMenu`, `ToolbarItemPlacement/topBarPinnedTrailing`, `ToolbarVerticalCompressionBehavior`, `ToolbarSpacer`,
`View/toolbarMinimizationBehavior(_:for:)`, UIKit `UITabBarController/prominentTabIdentifier`, `UINavigationItem/navigationBarMinimization`, `UIBarMinimization`. Talks: WWDC25 356; WWDC26 269, 278, 289, 292 (transcripts). App Store Connect "Screenshot specifications".

## Key facts
**Tab bars** (change log: 2025-07-28 added Liquid Glass; 2025-12-16 updated; 2026-06-08 "Updated terminology and art")
1. A tab bar is for **navigation, never actions**; actions that act on the current view belong in a toolbar. General rules [tab-bars#Best-practices]:
   - Keep the tab bar visible in every section. A modal may cover it.
   - Avoid the overflow **More** tab. When space runs out, the trailing tab turns into More.
   - Never disable or hide tabs. If a section is empty, explain why.
   - Use single-word labels.
   - Use SF Symbols, preferably filled. In compact width the icon sits above the label; in regular width they sit side by side.
   - Badges are a red oval with white text (a number or "!"), for critical information only.
2. Don't give tab labels a colour similar to the content-layer background. Over colourful content, use a monochrome tab bar or an accent colour that differs clearly. [tab-bars#Best-practices → color#Liquid-Glass-color]
3. On iOS, the tab bar **floats above content at the bottom of the screen** on a Liquid Glass background, and content peeks through. [tab-bars#iOS]
4. Minimize on scroll: a tab bar with an attached **accessory** (for example Music's MiniPlayer) can minimize when the person scrolls down, and the accessory then moves inline with it.
   - The HIG image shows the result: the minimized tab bar collapses into the current tab at the **leading bottom corner**, the accessory sits in the bottom centre, and the search tab is in the **trailing corner**.
   - It expands again when the person taps a tab or scrolls back to the top.
   - APIs: `TabBarMinimizeBehavior` = `automatic | never | onScrollDown | onScrollUp`; accessory placement = `expanded | inline` (`TabViewBottomAccessoryPlacement`). [tab-bars#iOS; SwiftUI docs]
5. The accessory is for persistent features such as media playback, not for screen-specific actions: "a checkout button … belongs with the content it supports" (WWDC25 356).
6. Search tab: iOS puts a dedicated search tab at the **trailing end**. With the semantic role (`Tab(role: .search)` or `UISearchTab`), the system separates it from the other tabs and places it there. [tab-bars#iOS; adopting-liquid-glass#Search]
   Search fields page (2026-06-08) gives two styles:
   - **Standard tab**: looks like the other tabs and opens a search landing page with the field at the top. Use it for discovery; Apple TV is the example.
   - **Button appearance**: shown as a separate button that immediately focuses the field and raises the keyboard. The experience is transient and returns to the previous tab.
   - WWDC26 292: the button appearance is made by "making Search a prominent tab". [search-fields#Search-as-a-tab]
7. Other iOS search placements: in a bottom toolbar, either as a field or as a button that animates into a field above the keyboard ("Place search at the bottom if there's room"); in a top toolbar, also called the navigation bar, as a button; or inline above the list it filters, optionally pinned to the top toolbar when scrolling. [search-fields#Search-in-a-toolbar, #Search-as-an-inline-field]
8. **iOS 27, prominent tab:** `TabRole.prominent` (27.0 on every Apple platform) gives *one* tab a prominent visual treatment.
   - If no tab has the role explicitly, a `.search` tab may get it by default.
   - The UIKit equivalent is `UITabBarController.prominentTabIdentifier`.
   - "The prominent tab is always visible, even when the tab bar collapses during scrolling" (WWDC26 278).
   - In the WWDC26 269 demo, a shopping-cart tab appears at the bottom trailing edge.
9. **iOS 27, sidebars on iPhone:** an iPhone app can opt into the tab bar's sidebar form (`sidebar.preferredPlacement = .sidebar`). It is the app's choice; people can't toggle it in the UI; the system shows it when there is room, for example in regular width (WWDC26 278).
10. iPadOS: the tab bar sits **near the top**, either fixed (`tabBarOnly`) or with a button that turns it into a sidebar (`sidebarAdaptable`). Tabs can be customised, with a default list of **five or fewer**. A toolbar and a tab bar can share the same top row. [tab-bars#iPadOS; toolbars#iPadOS]
11. Other platforms:
    - tvOS: the tab bar is **68 pt** tall and its top edge is **46 pt** from the top of the screen (both fixed). It is translucent and only the selected tab is opaque.
    - visionOS: always vertical, at the window's leading side, and it expands when looked at.
    - watchOS: not supported. macOS: no additional considerations.
    - **The HIG gives no height or inset for the iOS tab bar**; for icon dimensions it points to Apple Design Resources. [tab-bars#tvOS, #visionOS]

**Toolbars, including navigation bars** (change log: 2025-06-09 "…incorporated navigation bar guidance"; 2025-12-16 Liquid Glass)
12. The separate *Navigation bars* page is gone (the JSON returns 404). The HIG now says that on iOS "a navigation-specific toolbar is sometimes called a navigation bar". A toolbar holds three kinds of content: a title, navigation controls (back/forward, search) and actions. [toolbars#Navigation]
13. Titles: never use the app name, and keep titles **under 15 characters**. Use the standard Back and Close symbols and **no "Back" or "Close" text label**: a capsule "‹ Back" is shown as incorrect, the circular Back symbol as correct. On iOS, a large title shrinks to a standard title on scroll and returns at the top. [toolbars#Titles, #Navigation, #iOS]
14. Actions:
    - Prefer symbols to text, except for actions that symbols don't show well, such as Edit.
    - Use system symbols **without borders**; no outlined-circle symbols, because the group already provides a container.
    - **Use `.prominent` for the single key action** (Done, Submit): it separates and tints the action. Only one per toolbar, on the **trailing** side.
    - WWDC25 356: on iOS/iPadOS it often appears as a blue checkmark; on macOS, as a prominent text button. [toolbars#Actions]
15. Groupings [toolbars#Item-groupings]:
    - **Leading** edge: back, sidebar toggle, title, document menu. Not customizable.
    - **Centre**: common controls. Customizable on iPad and Mac, and they collapse into the system overflow menu first.
    - **Trailing** edge: important items, inspector buttons, optional search, the More menu, and the primary action. Always visible.
    - Group by function and frequency. Give navigation and critical actions (Done, Close, Save) their own groups. "In general, aim for a **maximum of three**" groups.
    - Keep a text-labelled action separate from symbol actions (use fixed space), or it reads as one button.
    - iPadOS and macOS add the overflow menu automatically; never add one yourself.
16. Use fewer toolbar backgrounds and tinted controls: let the content layer set the toolbar's colour and use `ScrollEdgeEffectStyle` to separate the toolbar from content. Standard items have **corner radii concentric with the bar**, and custom items must match. Items that share a background use either all symbols or all text, and every icon needs an accessibility label. [toolbars#Best-practices; adopting-liquid-glass#Menus-and-toolbars]
17. SF Symbols for common actions (icons#Standard-icons, 2025-06-09): Done `checkmark` · Cancel/Close `xmark` · More `ellipsis` · Share `square.and.arrow.up` · Compose `square.and.pencil` · Add `plus` · Search `magnifyingglass` · Filter `line.3.horizontal.decrease` · Delete `trash` · Undo `arrow.uturn.backward` · Redo `arrow.uturn.forward`.
18. macOS: the toolbar lives in the window frame, and its items have no bezel. Every toolbar item must also exist as a menu-bar command. The menu bar is **24 pt** tall. visionOS: the toolbar runs along the bottom of the window, and toolbars there must not be vertical. [toolbars#macOS, #visionOS; the-menu-bar]
19. **iOS 27 toolbar APIs (WWDC26 269, 278; names checked against the current SwiftUI and UIKit docs):**
    - `visibilityPriority` (`ToolbarItemVisibilityPriority`) decides which items stay visible when space runs short.
    - `ToolbarOverflowMenu` keeps items in the overflow menu permanently.
    - `topBarPinnedTrailing` pins the item to the trailing edge; the demo calls it "never hidden", but the doc says a pinned item still moves to overflow when search is active and there isn't enough room.
    - `toolbarMinimizationBehavior(.onScrollDown, for: .navigationBar)` makes the navigation bar slide away on scroll (values `automatic | never | onScrollDown | onScrollUp`; an integrated top tab bar minimizes with it). UIKit: `navigationItem.navigationBarMinimization.minimizationBehavior` (`UIBarMinimization`, same four values, plus `restorationBehavior` and `safeAreaAdjustment`). The WWDC26 talks used earlier names (`toolbarMinimizeBehavior`, `barMinimizationBehavior = .always/.never`); the current docs are used here.
    - Fixed spacers between groups: `ToolbarSpacer(.fixed)` / `fixedSpace(_:)`.
    - Menu bars on iPad and Mac now show icons on only a minimal set of key menu items by default (`labelStyle(.titleAndIcon)` or UIKit `preferredImageVisibility` forces one on).

**Sidebars** (change log: 2025-06-09 extend content beneath; 2026-06-08 "Updated guidance for sidebar icon colors, and clarified guidance for the adaptable sidebar style")
20. On iOS, iPadOS and macOS, sidebars **float above content in the Liquid Glass layer**. Let content run beneath them, either with horizontal scrolling or with the background extension effect. WWDC25 356: sidebars are "now inset and built with Liquid Glass", and scroll views extend beneath them by default. [sidebars#Best-practices]
21. Structure: show **at most two levels** of hierarchy; for deeper data, use a split view with a content list. Let people hide the sidebar, but don't hide it by default. Icons use the accent colour by default and must follow the user's accent colour on macOS; fixed colours are for rare meaningful cases, such as Mail's yellow VIP icon. [sidebars#Best-practices]
22. On iOS/iPadOS: "Consider using a tab bar first". With `sidebarAdaptable` you choose whether the app opens as a sidebar or as a tab bar, and both forms include a button to switch. For a sidebar only, use `NavigationSplitView`. [sidebars#iOS-iPadOS]
23. macOS: row height, text and glyph size follow the sidebar size (small / medium / large, a user setting in General). Don't put critical items at the bottom, and consider auto-hiding the sidebar when the window narrows. **macOS 27:** sidebars reach the window edges, the selected item is semibold, and bordered toolbar items over the sidebar become glass (WWDC26 289). [sidebars#macOS]

**iPhone Duo** (new HIG page, 2026-09-09: "Designing for iPhone Duo"; "the first folding iPhone" per design/whats-new)
24. On the **outer display**, toolbars, tab bars, navigation controls, the status bar and the Dynamic Island move to the **side** (the vertical axis) to save vertical space. Opened in landscape, the inner display keeps them on the side; in portrait it has room for normal horizontal bars. In Split View on the inner display, each app puts its controls on its outer edge, and they stay on the same side in right-to-left languages. [designing-for-iphone-duo#Vertical-controls]
25. Order on the vertical axis:
    - The top holds primary navigation (Back, Close), then prominent actions (Done).
    - Items overflow **from bottom to top** by default; set visibility priorities to change the order.
    - When space is tight: in a navigation-focused view, toolbar items go to overflow first (the default); in a task-focused view, the tab bar minimizes instead (`ToolbarVerticalCompressionBehavior`, **iOS 27.1 beta**).
    - Give every toolbar item that isn't text-only both a title and a symbol (the title is used in overflow menus). Items with text labels stay in a horizontal bar, so keep text buttons to a minimum.
    - Use the system overflow menu and keep the ellipsis symbol for overflow only. [designing-for-iphone-duo#Vertical-controls]
26. Reserved regions: the outer camera (always present), the inner camera (only while active) and the fold (when the device is partly open). In grids, prefer an even number of columns. Screenshot sizes: outer display **1398×2034 px**, inner **2007×2853 px** (App Store Connect screenshot specifications; uploads "available later this year"). [designing-for-iphone-duo#Reserved-regions]

## What it changes for the skills
- skills/design-studio/references/platforms/ios.md: Replace the old "bottom tab bar, 3–5 items" rule with facts 1–11 and 12–19. The tab bar floats and can minimize; the accessory is only for persistent features; search sits in the trailing tab (standard vs button style); one prominent tab in iOS 27; up to 3 toolbar groups; one `.prominent` trailing action; no "Back" text; iPhone sidebars in iOS 27; iPhone Duo vertical bars.
- skills/design-studio/references/disciplines/product-ui.md: Navigation chooser: tab bar vs sidebar vs `sidebarAdaptable`; where search goes (tab, bottom toolbar, top toolbar, inline); actions in toolbars, not tabs; checkout buttons stay with their content.
- skills/design-studio/assets/mockup-kit/kit.css + kit.json + demo.html: Remove the flush 49 px `.mk-tabbar` (current kit: `skills/design-product-ui/assets/mockup-kit/kit.css:61`). Draw:
  - a floating glass tab bar, plus its minimized state (current tab leading, accessory centre, search trailing);
  - grouped toolbar capsules with at most one tinted Done;
  - iPad tab bar at the top;
  - optionally, iPhone Duo side bars.
  Heights come from kits the lab has not read (see open items), so mark them as approximations.
- skills/design-studio/references/platforms/desktop.md: macOS toolbar in the window frame without bezels; every toolbar item mirrored in the menu bar; menu bar 24 pt; sidebar sizes; macOS 27 sidebar and toolbar changes.
- skills/design-studio/references/platforms/README.md: Cross-platform checklist: search placement per platform; the tab bar ↔ sidebar rule; "actions never in the tab bar".
- skills/critique-design/references/heuristics.md: Checks: no actions in the tab bar; at most one prominent action; no "Back" text; no more than three toolbar groups; text and symbol items not grouped together; no hidden or disabled tabs; no More overflow tab.
- skills/implement-design/references/stacks.md: `tabBarMinimizeBehavior`, `tabViewBottomAccessory`, `Tab(role: .search | .prominent)`, `sidebarAdaptable`, `ToolbarItemGroup`, `ToolbarSpacer`, `visibilityPriority`, `ToolbarOverflowMenu`, `topBarPinnedTrailing`, `toolbarMinimizationBehavior(_:for:)`; UIKit `prominentTabIdentifier`, `navigationBarMinimization`, `UISearchTab`, and iPhone Duo `ReservedRegion` / `ArrangementView`.

## Not verified / open
- iOS tab bar and toolbar geometry (height, bottom inset, capsule radius, item size, minimized size) is not in the HIG. It lives in the iOS 27 Figma and Sketch UI kits, which were not read. Any number in kit.json must say "approximation".
- The exact look of the iOS 27 "prominent" tab beyond "enhanced visual emphasis" and trailing placement.
- iPhone Duo point sizes and the width of the vertical bar; only screenshot pixel sizes were found. `ToolbarVerticalCompressionBehavior` is still in beta (27.1).
- tvOS and visionOS bar details were only skimmed, and watchOS toolbar placement was not studied in depth.
- iOS 27 API names changed between the June WWDC26 talks and the current docs (navigation-bar minimization, above). Re-check other talk-only names against the docs before putting them in stacks.md.
