# CJK font licensing facts: OFL families, free-to-use vendor fonts, commercial foundries
- id: cjk-font-licensing · url: https://openfontlicense.org/ofl-faq/ · fetched: 2026-09-27 · method: browser
- review_by: 2026-12-26 (perishable +90d: vendor terms and releases change) · licence note: paraphrased digest, not a mirror; not legal advice
> 中文导语：常用中文字体到底能不能子集化、能不能自托管成网页字体、能不能打包进 App、能不能商用。结论按许可证原文整理：OFL 家族（思源/Noto CJK、霞鹜文楷、得意黑、猫啃自制字体）可以子集化和自托管，但要处理"保留字体名"。厂商"免费商用"字体（HarmonyOS Sans、MiSans、OPPO Sans、vivo Sans、HONOR Sans、阿里巴巴普惠体）不是开源许可证：禁止修改，也禁止单独分发，所以子集化或转格式都有风险。方正、汉仪默认只授权个人非商用，网页、App、商标、包装都要另外购买授权。

Method, per source (all read 2026-09-27):
- GitHub repos read through the API, at the commits named below.
- Vendor pages rendered in headless Chrome (Playwright).
- Vendor zips downloaded, with the licence files and font tables (`fvar`, `OS/2.fsType`, name) inspected locally.
- The OFL-FAQ read from openfontlicense.org (version 1.1-update7, November 2023).

## Key facts
**The OFL mechanics** [openfontlicense.org/ofl-faq]
1. The OFL gives these permissions:
   - Use for anything, including commercial work. Acknowledgement is not required (FAQ 1.1.2).
   - **Bundle in apps**, including paid and mobile apps (FAQ 1.3, 1.4). The app must include the copyright statement, the licence notice and the licence text; mentioning them in the About box or changelog with a link to the font package is called good practice. Only the weights you use are needed (FAQ 1.20).
   - **Embed in documents**, in full or as a subset, with no modification or naming restrictions (FAQ 1.11–1.12).
   - Self-host through `@font-face`; the FAQ says this is "recommended and explicitly allowed by the licensing model because it is distribution" (FAQ 2.1).
   - The one hard "no": selling the font by itself (FAQ 1.5–1.6).
2. **Subsetting a webfont is modification** (FAQ 2.6). Converting to WOFF or WOFF2 is also modification, unless the font data is unchanged apart from compression and the metadata is carried over intact (FAQ 2.2–2.2.2). A Modified Version **may not use a Reserved Font Name (RFN)**, unless it preserves "Functional Equivalence" (FAQ 2.7–2.8).
   In practice, a subset font file must carry a new family name when the family has an RFN. The CSS `font-family` alias is yours to choose; the rule concerns the name inside the font file.

**OFL families** (repo, commit, licence header)
3. **Source Han Sans / Serif** (adobe-fonts/source-han-sans@0b99371, source-han-serif@4356704):
   - Licence: OFL 1.1, "with Reserved Font Name **'Source'**" (Sans `LICENSE.txt`: "Copyright 2014-2025 Adobe"; Serif: "2017-2022").
   - Latest releases: Sans **2.005R (2025-06-18)**, which ships `02_SourceHanSans-VF.zip` (variable fonts); Serif 2.003R (2024-07-30).
   - Adobe also publishes official region subsets (`05_SourceHanSansSubsetOTF.zip`, and CN/TW/HK/JP/KR packages). These are Original Versions, so the name may stay.
   - Your own subset must be renamed.
4. **Noto Sans/Serif CJK** (notofonts/noto-cjk@f8d1575):
   - OFL 1.1 with **no RFN** in `Sans/LICENSE` or `Serif/LICENSE`, nor in the font's own name table (NotoSansCJKsc-Regular.otf 2.004: copyright "© 2014-2021 Adobe", licence OFL 1.1), so a subset or WOFF2 may keep the name.
   - Latest releases: Sans2.004 (2022-01-27), Serif2.003 (2024-07-30). Noto Sans CJK therefore lags Source Han Sans 2.005.
5. **LXGW WenKai 霞鹜文楷** (lxgw/LxgwWenKai@8bd6319):
   - OFL 1.1 with RFNs **霞鹜 / 霞鶩 / 落霞孤鹜 / 落霞孤鶩 / LXGW**, plus a written **additional permission** in `OFL.txt`: a copy recompiled without source changes, or subset or converted to WOFF/WOFF2 **solely for web delivery**, may keep the names, provided it is not offered as an installable desktop font. `OFL.txt` names Google Fonts and "third-party non-commercial platforms recognized by the author"; the README's licence section names ZSFT as such a platform. Other platforms must ask the author.
   - The README also forbids mixing it into one font file with fonts under conflicting licences (it names GPL and IPA).
   - Latest release **v1.522 (2026-03-17)**.
   - Derived from Fontworks' Klee One (OFL; `OFL.txt` also carries "Copyright 2020 The Klee Project Authors").
6. **LXGW Neo XiHei 霞鹜新晰黑** (lxgw/LxgwNeoXiHei@14a0c28, v1.305, 2026-08-20) is **not OFL**: its `LICENSE.md` is the **IPA Font License v1.0**. That licence allows commercial and non-commercial use of printed and digital output (Art. 2.3) and has its own rules for derived programs (Art. 2.7 and Art. 3: redistribute the derived program's source files and a way to restore the original), so don't file it under OFL.
7. **Smiley Sans 得意黑** (atelier-anchor/smiley-sans@cbf2ce4):
   - OFL 1.1, RFN **Smiley** and **得意黑**.
   - v2.0.1 (2024-02-07). The release zip ships OTF, TTF and the authors' own WOFF2 files (Original Versions, so those keep the name; your own subset must be renamed).
   - One oblique weight. Covers all 6,763 hanzi of GB/T 2312 and all 8,105 of the 通用规范汉字表, plus extras: **8,335 hanzi** (README), far short of the 27,584 in GB18030-2022 implementation level 1 (figure from the MiSans and Alibaba GB18030 pages). A fallback font is required.
8. **Sarasa Gothic 更纱黑体** (be5invis/Sarasa-Gothic@f31c230, v1.0.42, 2026-09-26): OFL 1.1. It includes Adobe portions under the RFN 'Source'.
9. **猫啃 (Maoken) fonts**:
   - maoken.com is a directory ("已搜集 846 款免费中文字体") with a "存疑字体" (doubtful-licence) section. Its listings are not a licence: check each font's own terms.
   - Maoken's own releases on GitHub (org maoken-fonts) are OFL-1.1:
     - 猫啃什锦黑 (MaokenAssortedSans@f01a941, v1.70 2026-05-16; RFN "Assorted" / "什锦" under the "2022-11-02, ZERO子" copyright line; based on the OFL-licensed Nishiki-teki; the licence also carries a "2022-11-01, Umihotaru" copyright line).
     - 猫啃珠圆体 (maoken.com: "基于龙珠体进行圆润调整"; LongZhuTi's repo, maoken-fonts/LongZhuTi, is OFL-1.1 and itself derives from Fontworks' RocknRoll One; the maoken.com page tags 珠圆体 "OFL", Version 1.00 2023-02-22).
     - 猫啃网扛重族 (maoken-heavy-labourer@0fa30a7, derived from Source Han Sans/Serif Heavy; carries the 'Source' RFN notice).
     - Also 风雅宋 (fengyasong), 硬笔楷书 (MaokenYingBiKaiShuJ) and others. The org also hosts forks of third-party OFL fonts (e.g. zcool-kuaile, unbounded-sans), so check each repo's own licence header.

**Free-to-use vendor fonts: proprietary, "免费商用" but not open**
10. **HarmonyOS Sans 鸿蒙黑体**. Source: the licence in the official zip linked from the HarmonyOS design guide's font page (`LICENSE-update.txt`, dated 2026-06-26), "HarmonyOS Sans Fonts License Agreement", Huawei Device Co.
    - Grant: use, copy, merge, embed, bundle, redistribute and/or sell **unmodified copies … with any software except for fonts software**.
    - Conditions: (1) a **prominent notice in the software** that HarmonyOS Sans is used; (2) **no modifications** to the fonts or any component; (3) **no stand-alone redistribution or sale** (works made with it, such as logos, materials and apps, are free to distribute); (4) keep the notice and the agreement with every copy.
    - The licence is revocable and terminates automatically on breach.
    - The files: variable fonts, SC 20.6 MB, wght 40–900 (see harmonyos-design).
11. **MiSans** (hyperos.mi.com/font/zh/download/, 《MiSans 字体知识产权许可协议》, Xiaomi):
    - Grant: non-transferable, non-exclusive, royalty-free, revocable, worldwide.
    - Conditions: (1) **state in the software** that MiSans is used; (2) **no 改编或二次开发** (adaptation or derivative development); (3) no renting, sublicensing, lending or further distribution of the font or its copies on its own; works made with it (promo material, logos, **apps**) may be distributed or sold.
    - FAQ: free commercial use on any platform. **Embedding is allowed** with the notice. You may adjust weight and spacing in software, but may not change the font's appearance.
    - Families: 10 weights plus a variable version for each script, except **MiSans L3** (Regular only; 60,340 characters covering only the GB18030-2022 level-3 additions; the main MiSans covers levels 1 + 2). The homepage lists formats "VF/OTF/TTF/WOFF/WOFF2", so web formats come from the vendor.
12. **OPPO Sans 4.0** (coloros.com/article/A00000074, 2024-11-26; zip `OPPO_Sans_4.0.zip`):
    - Page terms: free for individuals and companies, including commercial use; (1) no 改编或二次开发; (2) no selling the font; (3) **no providing other download channels** (不向他方提供其他下载渠道); (4) no illegal use.
    - The bundled "OPPO Sans Fonts License Agreement" mirrors HarmonyOS Sans: unmodified copies may be embedded, bundled and redistributed with software other than font software; prominent notice; no modification; no stand-alone redistribution.
    - The page says "3 款字重", but the file is a single **variable font, wght 100–700** (v1.700) with five named instances (Light, Regular, Medium, SemiBold, Bold); `fsType` 8.
13. **vivo Sans** (developers.vivo.com/doc/d/314fa33cbaec4a93be351cd44757d9d9, page updated 2024-10-22; co-designed with FounderType):
    - Bundled 《vivo Sans字体知识产权许可协议》: (2.1) state in the software that vivo Sans is used; (2.2) no 改编或二次开发; (2.3) no renting, sublicensing, lending, further distribution or resale of the font or copies (works such as apps may be distributed); (2.4) keep the notice and the agreement in any copy; (2.5) no illegal use.
    - vivo may terminate the licence on breach (§5). Disputes go to the 广东省东莞市第二人民法院 (§6).
    - Files (`vivo Sans.zip`, download path dated 20241022, entries dated 2024-10-16): `OS/` has SC VF with **wght 100–850 and opsz 10–22** axes (44 MB), TC VF wght 100–850, SC L3 (static), a Latin/Greek/Cyrillic VF (also with opsz) and Latin width and italic variants (Std, Cond, Comp, Exp); `Brand/` has static "vivo Sans简体" and "vivo Sans Global" in 9 weights each.
14. **HONOR Sans** (developer.honor.com/cn/doc/guides/100681; zip `HONOR_Sans_1.2.zip`, 2023-12). HONOR Sans Copyright License Agreement:
    - Grant: use, copy, merge, embed, and/or redistribute **unmodified copies**.
    - Conditions: no modifications; no stand-alone redistribution or sale (works, including application software, are free); keep the notice and the agreement; **prominent notice in the software**.
    - honor.com support page (https://www.honor.com/cn/support/content/zh-cn15838783/): "荣耀字体可免费商用".
    - The download page says the package is "仅供电脑端使用".
    - Package contents: **static** fonts in 9 weights (Thin–Heavy) for CN, Latin, TC and Arabic. The system font's variable weight/中宫 axes are not in this download.
15. **Alibaba PuHuiTi 阿里巴巴普惠体 3.0**. alibabafonts.com lists 10 styles:
    - 35 Thin to 115 Black, plus 55 RegularL3.
    - 7 weights (35–95) at GB18030-2022 levels 1+2; Heavy and Black cover only GB/T 2312 + 通用规范汉字表; 55 RegularL3 holds only the level-3 additions.
    - The per-weight download zips ship TTF, OTF, **EOT, WOFF and WOFF2** (checked: `AlibabaPuHuiTi-3-105-Heavy.zip`, files dated 2023-04), with no licence file inside.
    Its 法律声明 (linked from the site; hosted on Yuque at https://www.yuque.com/yiguang-wkqc2/puhuiti/nus9wiinq4aeiegy) says:
    - Grant: a free, non-exclusive licence to **download, install and use**, for commercial or non-commercial purposes.
    - Without written permission, no **仿制、转换、翻译、反编译、反向工程、拆分、破解** (copy, convert, translate, decompile, reverse engineer, split, crack); no deleting, overwriting or altering the legal notice; no separate sale, rent, loan, transfer or sublicence.
    - The notice **grants nothing about embedding or web delivery**, and states that rights not expressly granted are reserved.
    - Jurisdiction: Hangzhou courts.

**Commercial foundries: FounderType 方正 and Hanyi 汉仪**
16. **FounderType**. Default licence 《方正字库知识产权用户许可协议》 (foundertype.com/index.php/About/powerAllowPro.html):
    - Scope: one Windows or macOS computer, **personal non-commercial** use (3.1). Disputes: 北京市海淀区人民法院 (9).
    - No copying, modifying, converting, translating or 拆分 (splitting).
    - Written permission is required for use in names, trademarks and logos, brochures, packaging, manuals, ads, **one's own website** (4.3.6), and exhibitions.
    - No embedding glyphs in portable documents such as PDF or Word without written permission (4.4); no network or multi-user use.
17. FounderType's three uses (powerbus.html):
    - 内部使用: internal install.
    - **内置使用**: embedding the font file, whole or partial, directly or converted, into websites, programs or devices.
    - 发布使用: using the typeface as a visual design element.
    **Five fonts are free for 发布使用 only**: 方正黑体, 方正书宋, 方正仿宋, 方正楷体, 方正甲骨文. Embedding is **not** covered and needs a separate embedded licence.
    Published prices (万元 per year per font, basic / 精选):
    - Full-media, per sub-brand: 0.7 / 2.
    - Single design piece: 0.15 / 0.45.
    - Packaging: 0.3 / 0.9.
    - Official website (one domain): 0.3 / 0.9.
    - Single logo: 0.3 / 0.9.
    - Permanent licence: 3× the annual price (basic) or 6× (精选); logos and other VI 2×.
18. **Hanyi** (hanyi.com.cn/license; faq-doc-2):
    - Any use other than personal non-commercial needs written permission, by a signed agreement or a licence certificate.
    - The personal non-commercial licence explicitly bars company names, trademarks, packaging, **网页设计** (web design), advertising, and loading the font into products.
    - Embedded use is a separate category (嵌入式业务).
    - Published prices (万元): full-media basic 0.6 for 1 year and 1.8 for 5 years, 10 years or permanent; 精选 1.8 / 5.8 / 9.8 / 10.8. Full-media excludes embedded use and trademarks/logos. Single design piece 0.15 / 0.4 (not for packaging or logos). Company website 0.3 / 0.9. Logo 1-year / permanent: basic 0.3 / 0.6, 精选 0.9 / 1.8.
19. Enforcement signals (primary statements only):
    - FounderType 郑重声明 dated **2015-12-11, 2022-10-24 and 2023-05-10**: renamed copies ("迷你/经典/碳纤维/沐君…体" and seven named fonts in 2023) are copied FounderType glyphs, and the company will pursue "一切司法救济手段" (all judicial remedies).
    - Hanyi's 《关于"迷你字库"的法律声明》 dated **2018-03-12** says the same about "迷你XX体" (Hanyi never released any "迷你" font).
    - Practical consequence: a "free" font whose name has a 迷你 / 经典 prefix is likely a pirated commercial face.

**Decision matrix** (derived from the texts above; ✓ allowed · ✗ not allowed · ? not addressed or ambiguous)

| Font | Commercial use | Subset / convert | Self-host on web | Bundle in app | Obligations |
|---|---|---|---|---|---|
| Noto CJK | ✓ | ✓ (no RFN) | ✓ | ✓ | ship OFL in app |
| Source Han, Smiley, Maoken OFL fonts, Sarasa | ✓ | ✓ but rename (RFN) | ✓ | ✓ | ship OFL; rename subsets |
| LXGW WenKai | ✓ | ✓ for web, name may stay | ✓ | ✓ | not as installable desktop font |
| HarmonyOS Sans, OPPO Sans, HONOR Sans | ✓ | ✗ (no modification) | ? unmodified file only | ✓ unmodified | notice in software; keep licence |
| MiSans, vivo Sans | ✓ | ✗ (no 改编) | ? (MiSans ships its own WOFF2) | ✓ (MiSans FAQ; vivo: apps named as works) | notice in software |
| Alibaba PuHuiTi | ✓ | ✗ (no 转换/拆分) | ? not granted (vendor zips include WOFF/WOFF2) | ? not granted | keep legal notice |
| FounderType, Hanyi | licence needed | ✗ | ✗ without licence | ✗ without embedded licence | purchase per use |

## What it changes for the skills
- skills/design-studio/references/fundamentals/cjk-typography.md: replace "open-licence faces" wording with the three-tier matrix above.
  - Default web recommendation: Noto Sans/Serif CJK or an OFL face, subset with cn-font-split. Rename the subset if the family has an RFN.
  - For vendor fonts: use the system font on its own platform (HarmonyOS Sans on HarmonyOS needs no bundling), or ship the vendor's unmodified files with the required "uses X font" notice.
  - Never subset or convert vendor fonts.
  - Treat 迷你 / 经典-prefixed "free" fonts as red flags.
- skills/design-studio/references/fundamentals/licensing.md: generic rules. A font licence splits into use, modify, redistribute and embed. "免费商用" is not "open source". Rights not granted are reserved. The obligation to credit the font in the app (HarmonyOS, OPPO, HONOR, MiSans, vivo) is a handoff item.
- skills/design-studio/references/process/handoff.md: the font line in a handoff lists font, licence, allowed delivery (system / bundled unmodified / subset webfont), and the notice text if one is required.
- skills/critique-design/references/heuristics.md: check the licence before accepting a CJK webfont; flag subset vendor fonts and FounderType/Hanyi faces without proof of licence.

## Not verified / open
- Whether serving an **unmodified** vendor TTF from a website counts as "redistribution with software" (allowed) or stand-alone distribution (not allowed) is not settled by any of the texts. OPPO's page forbids "other download channels", which argues against self-hosting it.
- Honor's claim of "dual variable weight + 中宫" applies to the system font (secondary sources); the downloadable 1.2 package is static.
- Alibaba PuHuiTi: the official zips include WOFF/WOFF2 (checked for 105 Heavy only; the other nine weights were not opened), yet the legal notice still grants only "download, install and use" and says nothing about embedding or web delivery. Whether shipping the vendor's own WOFF2 counts as permitted "use" is unanswered. User comments on the Yuque page ask about this (e.g. Linux packaging), but they are not authoritative.
- Court outcomes of FounderType or Hanyi cases (for example the often-cited 方正 v. 宝洁 case) were **not** read from primary judgments. The earlier audit claim "frequent enforcement" is supported here only by the companies' own public statements.
- Foundry prices are as published on 2026-09-27; they are list prices and can change.
- Google Fonts hosting of Noto/LXGW (a licence-clean CDN path) was not re-checked in this pass.
