# Accessibility law and standards by market (EU, US, ISO, China), as of 2026-09-27
- id: accessibility-law · url: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf · fetched: 2026-09-27 · method: fetch + browser + json-api
- review_by: 2026-12-26 · licence note: paraphrased digest, not a mirror
> 中文导语：一张按市场排的"法律引用哪个标准、哪个版本、哪天生效"对照表：欧盟 EAA 与 EN 301 549（v4.1.1 已发布，但还没在官方公报上引用），美国 ADA Title II（期限推迟到 2027/2028），ISO/IEC 40500:2025，以及中国的《无障碍环境建设法》、GB/T 37668 和一批 2025–2026 年新出的适老化、无障碍国标，外加工信部适老化规范里的具体数字。设计目标定为 WCAG 2.2 AA；交付时写清楚面向哪个市场、对应哪条法规。

Read on 2026-09-27. EU: Directive (EU) 2019/882 full text via the Publications Office cellar (`http://publications.europa.eu/resource/celex/32019L0882`,
because EUR-Lex blocks automated fetches); Implementing Decision (EU) 2021/1339 (cellar `32021D1339`); ETSI deliver directory
`/deliver/etsi_en/301500_301599/301549/` and the EN 301 549 V4.1.1 PDF (browser; pdftotext). US: Federal Register API documents 2024-07758 and
2026-07663 (full text); access-board.gov/ict (Revised 508 Standards). ISO: iso.org/standard/91029.html (browser); W3C WAI news 2025-10-21 and the W3C
press release. China: npc.gov.cn law text; std.samr.gov.cn national-standard search and detail pages (browser); miit.gov.cn notice
工信厅信管函〔2021〕67号 with its three annexes (browser).

## Key facts
EU: European Accessibility Act (Directive (EU) 2019/882)
1. Member States had to transpose by **2022-06-28** and **apply from 2025-06-28** (Art. 31(1)–(2)). Answering 112 emergency calls may apply from
   2027-06-28 at the latest (Art. 31(3)).
2. Scope (Art. 2): products placed on the market after 2025-06-28 (consumer computers and their OS, payment terminals, ATMs, ticketing and check-in
   machines, interactive information kiosks, phones and other consumer terminals for e-communications and AV media, e-readers). Services provided
   to consumers after that date: electronic communications, access to AV media, the **websites, mobile apps, e-tickets and real-time information of
   air, bus, rail and water passenger transport** (urban, suburban and regional transport: only their self-service terminals),
   **consumer banking**, **e-books and dedicated software**, **e-commerce**.
3. Excluded content of websites and apps (Art. 2(4)): pre-recorded time-based media and office files **published before 2025-06-28**; online maps
   (if the essential information for navigation is accessible in another digital form); third-party content not funded, developed or controlled by
   the operator; archives not updated after 2025-06-28.
4. Websites and apps must be accessible "in a consistent and adequate way by making them **perceivable, operable, understandable and robust**"
   (Annex I, Section III, point (c), the general requirements for all services; Section IV adds sector-specific ones such as POUR identification
   and payment for banking and e-commerce). The Directive names no WCAG version itself.
5. **Microenterprises providing services are exempt** (Art. 4(5)). Microenterprise = **fewer than 10 persons** and turnover or balance sheet
   **≤ EUR 2 million** (Art. 3(23)). Operators may rely on fundamental alteration or disproportionate burden only after an assessment that is
   **documented and kept for 5 years** (Art. 14(2)–(3); microenterprises dealing with products need not document it, and service providers renew
   it at least every five years, Art. 14(4)–(5)).
6. Transition (Art. 32): services may keep using products they lawfully used before 2025-06-28 **until 2030-06-28**. Service contracts agreed before
   2025-06-28 continue unchanged until they expire, but no longer than five years from that date. Member States may allow **self-service terminals**
   in use before that date to stay until the end of their economic life, **max 20 years** after entry into use.
7. Presumption of conformity comes only from harmonised standards **whose references are published in the OJEU** (Art. 15(1)).

EU: EN 301 549
8. **V3.2.1 (2021-03)** is the version cited in the OJEU, by Implementing Decision (EU) 2021/1339, under the **Web Accessibility Directive
   (EU) 2016/2102** (public-sector websites and apps). It maps to WCAG 2.1 AA.
9. **V4.1.1 (2026-09)** was published in the ETSI deliver directory on **2026-09-02** (draft V4.1.0 for enquiry 2025-11-12, vote draft 2026-06-24).
   Its foreword: prepared under standardisation request **C(2022) 6456 (M/587)** for the EAA. It confers presumption of conformity with 2019/882
   **"once… cited in the Official Journal"**. National transposition dates: adopted **2026-08-24**; doa **2026-11-30**; dop/e **2027-05-31**;
   dow **2028-05-31**.
10. V4.1.1 changes: clauses 9 (web), 10 (documents) and 11 (software) aligned to **WCAG 2.2**; new **Annex ZB** (mapping to EAA requirements) and
    **clause A.2** (EAA conformance tables); Annex ZA updated for 2016/2102; RTT/total conversation extended. 4.1.1 Parsing is dropped: clause 9.4.1.1 is now
    "Void", with a note explaining why (the document and software clauses carry the same note). Clause 9.0: WCAG 2.2 AA equals clauses 9.1–9.4 plus 9.6. WCAG 2.1 AA equals the same minus 9.2.4.11, 9.2.5.7, 9.2.5.8, 9.3.2.6,
    9.3.3.7 and 9.3.3.8.
11. New **user-preference clauses**. **9.7**: a web page shall not block the user agent's preference modes or explicitly override documented
    platform accessibility settings unless essential. Note 4 names CSS `forced-color-adjust` as an override to use only where essential. **11.7**:
    non-web software shall follow platform accessibility preferences. Note 6 lists colour filters, contrast, text size, pointer size and text cursor.
12. Native apps are covered by clause 11 with WCAG wording adapted. **11.2.5.8** applies the 24 x 24 CSS px target-size criterion to non-web
    software. Clause 4.2.2 (usage with limited vision), note 4: best practice is smallest text with an **x-height ≥ 8 CSS px** (1.2 mm at 400 mm
    viewing distance), a floor and not a body size. Clause 5.1.4: ICT whose functionality is closed to text enlargement (kiosks) must offer a mode
    with text **x-height ≥ 16 CSS px**.
13. No Commission implementing decision citing V4.1.1 was found as of 2026-09-27 (a Publications Office SPARQL title search for 2026 acts naming
    Directive 2019/882 returned only a court case and procurement documents; see "Not verified"). Until one is published, V4.1.1
    gives no formal presumption under the EAA, and V3.2.1 stays the cited version under 2016/2102.

US
14. **ADA Title II** final rule (DOJ, 89 FR 31320, published 2024-04-24, effective 2024-06-24): web content and mobile apps of state and local
    governments must meet **WCAG 2.1 Level AA** (the static 2018 version, 28 CFR 35.200–35.205).
15. Interim final rule **91 FR 20902 (2026-04-20, effective that day)** moved compliance dates: population **≥ 50,000: 2026-04-24 → 2027-04-26**.
    Population **< 50,000 and special district governments: 2027-04-26 → 2028-04-26**. Comments closed 2026-06-22. DOJ says it "plans to engage in
    future rulemaking" on the rule's substance and may issue an NPRM. If none is issued and nothing suggests further delay, it "fully anticipates
    implementing the regulation at the new deadline".
16. **Section 508** (federal agencies; Revised 508 Standards E205.4): electronic content conforms to **WCAG 2.0 Level A and AA**.

ISO
17. **ISO/IEC 40500:2025** "W3C Web Content Accessibility Guidelines (WCAG) 2.2", edition 2, ISO lists publication **2025-09**, 72 pages, free (CHF 0).
    W3C announced the approval on **2025-10-21**, processed through JTC 1 as a PAS. W3C: it is "the **October 2023 version** of WCAG 2.2" (not the
    2024-12-12 errata edition), and W3C is working to update ISO/IEC 40500 and EN 301 549 to the latest 2.2 text. The ISO page shows stage 90.92
    "to be revised" with **ISO/IEC DIS 40500** under development.

China
18. **《中华人民共和国无障碍环境建设法》**: adopted 2023-06-28 (14th NPC Standing Committee, 3rd session), **in force 2023-09-01** (Art. 72). Art. 32:
    websites, service platforms and **mobile apps built with public funds "应当逐步符合"** the accessible-website design standards and national
    information-accessibility standards. The State **encourages** news, social, shopping, health, finance, education and transport sites and apps to
    comply gradually, and encourages map apps to add accessible-route navigation. Art. 33: terminal makers should gradually provide voice and large-font
    functions; self-service terminals in banks, hospitals, metro stations, airports, bus and ferry stations and large scenic areas **must** provide
    voice, large font and braille. Art. 29: emergency information in voice, large type, braille and sign language where conditions allow. Art. 51:
    local standards may not be lower than national ones.
19. **GB/T 37668-2019** 《信息技术 互联网内容无障碍可访问性技术要求与测试方法》: recommended national standard (推荐性), issued 2019-08-30, in force
    **2020-03-01**, TC28/SC35. Reviewed 2025-07-01 with the conclusion **修订**. The revision (plan **20252537-T-469**, same title) is "正在批准"
    (in approval): a 12-month project issued 2025-07-01 that adopts **ISO/IEC 40500:2025 (WCAG 2.2) non-equivalently (非等效)**. This contradicts
    the audit note that "no newer national standard" exists (research-knowledge.md §5).
20. Newer national standards found on std.samr.gov.cn (all 推荐性 except GB/Z 41284, a 指导性技术文件; contents not read): **GB/T 45395-2025** 小程序应用无障碍技术要求 (issued and in force
    2025-03-28); **GB/T 46070-2025** 移动智能终端信息无障碍通用规范 (issued 2025-08-29, in force 2026-03-01); **GB/T 47523-2026** 移动互联网应用程序适老化
    技术规范 (issued 2026-04-30, **in force 2026-11-01**; MIIT/TC485; drafted by CAICT with China Mobile, Douyin, Alibaba, Ant, vivo, Xiaomi, 上海寻梦,
    拉扎斯, Ping An Bank); **GB/T 47797-2026** 政务服务平台适老化服务建设指南 (issued 2026-07-02, in force 2026-11-01); **GB/T 45445-2025** 电子商务平台适老化通用要求
    (2025-02-28); **GB/Z 41284-2022** 信息无障碍 网站设计无障碍评级测试方法 (reviewed 2026-01-08, kept); **GB/T 18978.171-2024** 软件无障碍设计指南 (in force
    2025-07-01); **GB/T 44382-2024** 与年龄相关的色光亮度对比度规范; **GB/T 44808.2-2024** age-related colour-vision colour combinations; **GB/T 44808.4-2024**
    minimum legible character size by age; **GB/T 32632-2026** ICT terminal accessibility design principles (in force 2027-03-01).
21. **MIIT notice 工信厅信管函〔2021〕67号** (dated 2021-04-06, published 2021-04-12), implementing 工信部信管〔2020〕200号. Websites follow Annex 1 +
    GB/T 37668-2019 + YD/T 1822-2008 (guided by the Internet Society of China). Apps follow Annex 2 + GB/T 37668-2019 (guided by CAICT). Evaluation:
    user satisfaction 40 %, technical 40 %, self-assessment 20 %, pass at **≥ 60/100**. The badge is valid **2 years**, with spot checks.
22. **Annex 2, 《移动互联网应用（APP）适老化通用设计规范》** (numbers a designer needs):
    - Type: sans-serif recommended; size adjustable (follow the system or an in-app setting). Main functions and main screens must reach a **largest
      size ≥ 30 dp/pt**. In the elder-mode UI (适老版界面) or a standalone elder app, main text **≥ 18 dp/pt**.
    - Line spacing **≥ 1.3x**; paragraph spacing **≥ 1.3x the line spacing**.
    - Contrast **≥ 4.5:1** for text, text images and icons; **≥ 3:1** for text **larger than 18 dp/pt**. Colour is never the only cue.
    - Touch targets: elder-mode UI main components **≥ 60 x 60 dp/pt**, other pages **≥ 44 x 44**. Standalone elder app home screen **≥ 48 x 48**,
      other pages ≥ 44 x 44.
    - Gestures give feedback; no gesture needing **3 or more fingers**. Enough time: where a time limit is not essential and involves no legal
      commitment or financial transaction, the UI does not change before the user finishes.
    - Pop-ups: an easy close button, **only at top-left, top-right or bottom-centre**, hit area **≥ 44 x 44 dp/pt**.
    - Entry: a prominent switch to elder mode on the home screen or a first-launch prompt, plus a **"长辈版"** entry in Settings. In-app search must find
      "长辈版", with aliases 亲情版 / 关爱版 / 关怀版.
    - Puzzle or image-selection CAPTCHAs need a form for another sense (text or voice). Screen readers must not be blocked, and every functional
      component must work with them.
    - **No ads or ad plug-ins** (and no random ad pop-ups) in elder mode or elder apps; **no induced download or payment buttons** anywhere in the app;
      personal data kept to the minimum necessary.
23. **Annex 1, 《互联网网站适老化通用设计规范》**: flat layout (avoid shadows, perspective, textures) or a separate simplified large-block version;
    regions told apart by colour. Desktop sites offer zoom and a large-text screen independent of the OS and browser. **Mobile web offers at least one
    font size ≥ 18 dp/pt.** Obvious focus states. Voice reading for components and text, at least on article pages, with an on/off switch. Visual
    CAPTCHAs need **≥ 2x magnification (including drag CAPTCHAs) and a non-visual alternative such as voice (both required)**. Codes that expire in
    **≤ 3 min** must announce the time limit by voice and allow extension to **≥ 2x**. Legal or financial submissions are reversible **within 10 min**
    (undo, or edit and resubmit; flash sales excepted). No ads or induced buttons in elder pages. Promotional floating windows come with page load and
    offer a permanent close. Avoid jargon and internet slang; keep common names and icons; offer "undo last step". Desktop: full keyboard operation and
    an extra-large cursor. Provide a desktop shortcut or client straight into the elder service.

## What it changes for the skills
- skills/design-studio/references/fundamentals/accessibility.md: a legal matrix, market → instrument → cited standard/version → dates (facts 1–21).
  Design target WCAG 2.2 AA everywhere; legal minimum today EU public sector EN 301 549 V3.2.1 (WCAG 2.1 AA), EU EAA V4.1.1 pending OJEU citation,
  US Title II WCAG 2.1 AA from 2027-04-26 / 2028-04-26, US federal WCAG 2.0 AA, CN GB/T 37668-2019 (revision pending) plus 适老化 specs. Replace
  "WCAG 2.2 AA is … the legal reference in most places" (`color.md:59` today) with this matrix.
- skills/design-studio/templates/PRODUCT.md (Accessibility line) and process/truth-files.md: record target markets and sectors (EAA covers
  e-commerce, banking, transport, e-books, telecoms; microenterprise exemption for services), then derive the legal floor from the matrix.
- skills/design-studio/references/platforms/README.md, platforms/android.md, platforms/ios.md, platforms/harmonyos.md: for apps shipped in China,
  plan an elder mode (长辈版) as a first-class surface: entry points and search aliases, 60 x 60 dp targets in elder mode, main text ≥ 18 dp, scalable
  to ≥ 30 dp, no ads, pop-up close positions. GB/T 47523-2026 applies from 2026-11-01 (content still to be read).
- skills/design-studio/references/platforms/mini-programs.md: cite GB/T 45395-2025 (mini-program accessibility) alongside the WeChat 适老化 rules.
- skills/design-studio/references/platforms/web.md: EN 301 549 9.7. Do not override user preferences; `forced-color-adjust: none` only where
  essential; respect platform text size and contrast settings.
- skills/design-studio/references/disciplines/product-ui.md: CAPTCHA alternatives (voice + 2x zoom), a 10-minute undo for legal or financial
  submissions (CN web spec), pop-up close placement and 44 x 44 hit area, no ads or induced buttons in elder flows.
- skills/design-studio/references/process/handoff.md and templates/acceptance-report.md: state the conformance target (standard, version, level)
  and the market it serves. For the EU, name EN 301 549 V4.1.1 clause A.2 / Annex ZB as the target structure.
- skills/critique-design/references/rubric.md: add a market-specific legal check (which instrument applies, and whether the design meets its cited
  version) in the Accessibility dimension.

## Not verified / open
- Review trigger (perishable, +90d): OJEU citation of EN 301 549 V4.1.1, a DOJ Title II NPRM, publication of the GB/T 37668 revision, GB/T 47523 entering into force (2026-11-01).
- OJEU citation of EN 301 549 V4.1.1: no implementing decision was found (search plus secondary reports forecasting October–November 2026). The audit's
  "citation target ~2026-11-30" mixes this up with the standard's own **doa** date (2026-11-30). Recheck EUR-Lex after 2026-11-30.
- The audit said "the EAA's legal reference remains v3.2.1 until OJEU citation". Primary sources show V3.2.1 is cited under 2016/2102 (public sector),
  not under 2019/882. The EAA's own requirements are the functional ones in Annex I; using V3.2.1 for EAA work is common practice, not a presumption.
- No primary text was read for GB/T 37668-2019 thresholds, the pending revision, or GB/T 47523 / 45395 / 46070 (openstd previews are images). Do not
  quote numbers from them until read.
- ADA Title III (private businesses) has no DOJ web technical standard in what was read. State laws, Canada (ACA/EN 301 549 adoption), UK, Japan
  (JIS X 8341-3) and Korea were not covered.
- EAA national transposition details (penalties, national deadlines, how member states implement Art. 32) were not read.
- Fact-check 2026-09-27 (independent re-read of the Directive via cellar XHTML, the ETSI PDF, Federal Register full texts, access-board.gov,
  iso.org in Chrome, npc.gov.cn, std.samr.gov.cn and the gov.cn/miit.gov.cn copies of 67号 incl. the Annex 3 weight table image): corrected the
  EAA website/app clause (Annex I Section III(c), not Section IV), the EN 301 549 x-height note (clause 4.2.2 note 4, not a note to 9.1.4.4),
  GB/Z 41284 (指导性技术文件, not 推荐性), and added "dedicated software" to the EAA e-book scope.
