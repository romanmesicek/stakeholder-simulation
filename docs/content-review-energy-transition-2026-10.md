# Content Review: Energy Transition, Bachelor vs. Master (October 2026)

ET bachelor compared with ET master, Talstadt (the other bachelor scenario) and Data Centers (the most recently reviewed scenario), ahead of a bachelor run of Energy Transition. Status: all items below done (October 2026, version 3.1.0).

## Verdict

The bachelor briefing was short by design and stays short. The real gap was in the parts students negotiate with: bachelor role cards (~350–480 words) and Key Facts (~370 words) had about half the substance of Talstadt's (~700–900 / ~1,700). Missing were authority, leverage, tips, and numbers that turn demands into comparable costs. The bachelor flow also treated the two optional groups (Indigenous, Technical) as an afterthought, although the app already lets facilitators select all 8.

## Findings and fixes

| # | Finding | Fix | Status |
|---|---------|-----|--------|
| 1 | Bachelor cards lacked "Your authority / Who you answer to" and any negotiation scaffolding; Management card thinnest (no "What you control", no confidential info) | All 8 cards: authority + accountability lines, "Negotiation tips" (trade-offs, leverage, vulnerability; no named allies, so the August decision "bachelor discovers coalitions itself" stands); Management: resources, confidential Board threshold | ☑ |
| 2 | Investors could not translate deal money into their return red line; master's "−0.8% per €100 M" had no base and did not fit the Investors ladder | Return rule: ~9.5% at €3.0 bn company spend, −0.8 points per extra €100 M, public/EU money excluded. Fits all ladders (€2.8 bn → 11.1%, €3.1 bn → 8.7%, 7% at ~€3.3 bn). Bachelor Management + Investors cards; master Management + Investors cards and role overview | ☑ |
| 3 | Money ZOPA opaque: unclear how much of the €400 M line is restoration | Split ~€300 M shutdown/demolition + ~€100 M site restoration (both levels' Key Facts). River restoration (€60–80 M) is part of Environmental's restoration total, not on top | ☑ |
| 4 | Bachelor Key Facts missing jobs (300 permanent / 1,200 temporary / ~750 indirect), penalty, 10-year deadline, the places, a glossary | Added, incl. glossary (MW/MWh, ESG, contingency, credit facility, stranded asset, hurdle rate, credit rating, just transition, BATNA, Deal Sheet, Feasibility Certificate) | ☑ |
| 5 | No definition of "agreement" in bachelor | Deal Sheet + agreement rule: Management + Government + at least half of the other groups in play (+ Feasibility Certificate if Technical plays). Bachelor only, per decision | ☑ |
| 6 | Bachelor negotiation thin: 2 rounds, 4 generic prep steps | 3 rounds (assigned bilateral → open bilateral → coalitions & Deal Sheet); 5 strategy questions in Phase 1 | ☑ |
| 7 | 7th/8th groups not supported in the bachelor flow | Briefing lists all 8 ("if in play") + region paragraph; speaking order and Round-1 pairings for 6/7/8; agreement-rule table per configuration; ownership-stake price (10% ≈ €30 M); observation sheet rows; event card E4 river; common problem "small groups ignored"; group-size guidance; `levelMeta` "6–8 groups" | ☑ |
| 8 | Community constraint contradicted its own ladder (70% siting vs. Acceptable 65%; master also €250 M fund vs. Acceptable €200 M) | Constraints set to the Acceptable floor (65%, €200 M), both levels | ☑ |
| 9 | Leftover durations against the "no durations" rule (bachelor event cards "minute 10–20", "35-minute"; master "20-minute debrief") | Replaced with round-based wording | ☑ |
| 10 | Bachelor debriefing thin | Results check against the ladders, third theory anchor "Just transition in three questions" (who pays / decides / is heard), real cases (German coal commission 2019, Spain 2018), concrete facilitator tip | ☑ |
| 11 | Small issues: unexplained "€750 M equity" and "€400 M bond issues"; "23,000 voters"; briefing coal cost without "incl. environmental costs" | Explained in plain language; "residents"; aligned | ☑ |
| 12 | ~170 em-dashes in bachelor files, ~170 in master (Roman's style rule: none) | Bachelor files rewritten; master swept (paired dashes → commas/parentheses, single → colon/semicolon, reviewed line by line) | ☑ |
| 13 | Master had no consolidated number table | Calibration table at the top of `master/facilitator/role-overview.md`; money ZOPA recomputed (~€575 M Acceptable, ~€840 M Best) | ☑ |
| 14 | Master inconsistencies found while calibrating: Government card "20% reserve margin" (elsewhere 18%); "EPA standards" (US agency in an EU case); Indigenous ownership stake unpriced; no rule against draining the contingency | 18%; "EU and national standards"; 10% stake ≈ €30 M in Key Facts + Indigenous card; Technical Panel certifies only with €600 M grid/storage intact and ≥€100 M contingency; river restoration declared part of Environmental's total | ☑ |

## Decisions

- Deal Sheet and agreement rule: **bachelor only**. Master keeps its flow until the larger "real closing conference" redesign (open idea in `content-review-2026-08.md`).
- Em-dash rule: first bachelor only, then extended to master on Roman's request.
- All 8 groups must be playable at bachelor level; the default selection stays at 6.
- The calibration tables in `bachelor/facilitator/role-overview.md` and `master/facilitator/role-overview.md` are the single source of truth for each level's numbers.

## Open

- After the bachelor run: check whether the return rule and Deal Sheet were actually used (observation sheet has fields for both).
