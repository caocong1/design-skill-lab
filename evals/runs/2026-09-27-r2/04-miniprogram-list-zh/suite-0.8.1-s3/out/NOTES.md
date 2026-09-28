# NOTES: 拾光到家 · 服务 tab

## Assumptions (one per line)

- Mode `piece`, effort `standard`. Canvas 375 × 812, fixed layout (750 rpx). 1 CSS px = 2 rpx.
- Custom navigation: status bar 0–44. The nav row is 44–88, centred on the capsule (y 66). The location control ends at x 233, left of the capsule (281) with a 48 px gap.
- The capsule is drawn as a neutral light-scheme placeholder at left 281, top 50, 87 × 32. The real build reads `wx.getMenuButtonBoundingClientRect()` at runtime.
- The native tab bar (首页 / 服务 / 订单 / 我的, 49 px, `#F7F7F7`, selected colour = brand teal) and the 34 px home-indicator safe area are drawn as system elements. The 10 px tab labels are WeChat's native size, not a design choice.
- The filter panel drops down from the sort bar and ends above the native tab bar, because a page layer cannot cover the native `tabBar`. This avoids `wx.hideTabBar`.
- The dim layer behind the panel covers only the list region. Location, search, categories and the sort bar stay visible, so the user can see which category they are filtering.
- The rows behind the open panel are left out of filter.html because the opaque panel hides them completely.
- In the 服务人员 filter, "不限" is the default. It shows as tinted but has no check badge, so the three badges match the "筛选 3" count.
- The category tabs scroll sideways. The fifth tab (管道疏通) fades out at the right edge on purpose, as the scroll cue. This is not a truncation bug.
- Sorting is four equal inline options (no dropdown), because choosing beats opening a menu. At WeChat font sizes above standard, the plan is to collapse them into a "综合排序 ▾" dropdown so 筛选 keeps its place. That variant is not drawn.
- Filter options at large font sizes should go from four per row to three per row. This is not drawn (see "Not verified").
- Tapping a list row opens the service detail, where booking happens. No per-row "预约" button, to keep rows calm and avoid a sales feel.
- The time slot on the left of each row shows the brief's "最近可约" value. "可上门" is the label for that slot, not new data.
- Dates and times are copied from the brief: 今天 / 明天 / 9/29 周二 / 9/30 周三, 24-hour times.
- Counts are shown exactly as the brief gives them (12,480 次), not rounded to 万, to avoid changing the data.
- Price formats are the brief's, split into a bold amount and a lighter unit: "¥129 起", "¥89 / 台", "上门费 ¥50，材料另计".
- In the filter panel the relaxation "去掉「可开发票」" is shortened to "不限发票" to fit one line. The no-results screen uses the full wording.
- The no-results suggestions are sorted by how many results they give: 明天 6, 3 km 内 4, 去掉可开发票 1.
- Every suggestion, and every "已选" chip (with ×), can be tapped. 修改筛选 reopens the panel and 清除筛选 clears all three filters. Both buttons have the same secondary weight, because the suggestion rows are the main path.
- The no-results sentence is the brief's own sentence, split into two lines.
- No coupons, promotions, members, photos or reviews were added. The only data shown comes from the brief.
- Chinese copy convention: spaces between Chinese and Latin letters or digits ("1 km 内", "已服务 862 次"). Full-width punctuation, corner quotes 「」.

## Visual system

- Font: the system face (`-apple-system` / PingFang SC). On device the mini-program uses the WeChat system font. No web fonts are loaded.
- Colour: ink `#1B1F1E`, secondary `#474F4C`, tertiary `#626B68`, brand teal `#0A6456`, teal tint `#E3F0EC`, neutral fill `#F2F3F1`, hint panel `#F6F1E6`.
- Contrast, computed with color_tools: the lowest text pair in use is tertiary on the neutral fill at 4.94:1 (the search placeholder and the "可上门" label on non-today slots). White on teal is 7.07:1. All text pairs pass AA.
- The star icon `#E0A21B` is decorative. The rating number next to it carries the value.
- The main idea: each row starts with an appointment "slot stub" (day / time / 可上门). It is teal when the slot is today and neutral for later days, so "who can come today" can be scanned first.
- Type scale: 12 / 14 / 15 / 16 / 17 / 20. Targets are at least 44 px, including chips and inline links.

## Images and licences

- All icons, the status bar, the capsule placeholder and the empty-state illustration are hand-drawn inline SVG made for this work. No external images, fonts or libraries.

## Verification

- Rendered with Playwright + Chrome at 375 × 812, DPR 2 (750 × 1624). `lint.mjs --platform miniprogram` floor passes on all three pages: contrast, overflow, accessible names and 44 px targets.
- Remaining lint warnings are known and accepted:
  - the intentional category-tab fade;
  - list row 4 continuing below the tab bar, which is the scroll region;
  - type-scale and line-height drift notes.
- One fresh critique round: the verdict was "fix".
- Fixed in one batch:
  - the filter badge was pushed off-screen by the sort bar;
  - the zero-result hint listed only two of the three relaxations and could not be tapped;
  - the type scale was merged;
  - the default "不限" had a check badge;
  - the list header repeated the sort;
  - the no-results button weights were unclear.
- Not verified:
  - WeChat large-text and care mode (1.4 ×). A 125 % simulation by the critic showed the four-per-row filter options clipping. The planned three-per-row and dropdown-sort variants are not drawn.
  - Dark mode and loading/error states are out of scope for this brief and not drawn.
