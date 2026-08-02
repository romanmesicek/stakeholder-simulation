# Content-Review — August 2026

Konsolidierter Befund aus drei parallelen Reviews (Talstadt-Inhalt, Energy-Transition-Inhalt, Didaktik gegen die Best-Practice-Quellen in `material/`) vor dem Herbstsemester 2026. Schritt 2 des Verbesserungsplans (Schritt 1 = Code, siehe [code-review-2026-08.md](code-review-2026-08.md); Schritt 3 = SaaS-Idee).

Status: ☑ erledigt (Paket 1, August 2026) · ☐ offen (Todo für Paket 2/3)

---

## Gesamturteil

Beide Cases stehen didaktisch und handwerklich auf solidem Fundament: einheitliche Rollenkarten mit quantifizierten Zielen und roten Linien (Best/Acceptable/Avoid), echte Bachelor/Master-Differenzierung bei Energy Transition, durchdachte Einigungszonen, und das Master-Debriefing (Defusing → Discovery → Deepening → Transfer inkl. Theorieanbindung) übertrifft die Best-Practice-Literatur. Talstadts Zahlen sind app-intern über alle 11 Dateien widerspruchsfrei. Die Schwächen: einzelne harte Fehler (Paket 1, behoben), Lücken in der Verhandlungslogik (Paket 2) und ungleich verteilter Facilitator-/Assessment-Support (Paket 3).

---

## Paket 1 — Fehler & Fakten (☑ erledigt August 2026)

### Talstadt

- ☑ **Sauerstoffgehalt der Schwarzach ergänzt** (3 mg/l fabriknah; Fische brauchen ~4 mg/l, Güteklasse II ~6 mg/l) — in Key Facts §2 (TÜV-Tabelle + Fazit), Umweltamt- und Anglerclub-Karte. Vorher war die zentrale Pointe „Grenzwert eingehalten, Fluss kippt trotzdem" nicht belegbar und die Anordnung des Amts angreifbar; die Begründung über §6 WHG (Gewässerzustand zählt, nicht nur der Messwert) steht jetzt in der Amtskarte.
- ☑ **Tippfehler:** „üble Gerüchte"→„Gerüche" (Stadtrat — kollidierte mit den echten Verkaufs-„Gerüchten"), „Bedürfigkeit"→„Bedürftigkeit", „Verhaltensmaßiger"→„Verhältnismäßiger", „überschreitet fast"→„erreicht fast" (Umweltamt).
- ☑ **Anglerclub-Schaden beziffert** (aus dem Original): rund 7.000 EUR Schäden in zwei Jahren + 12.000 EUR verlorene Jungfische — in Rollenkarte (Situation, Ziel 2 als Verhandlungsanker) und Zeitungsbericht in Key Facts §5.

### Energy Transition

- ☑ **MW-Widerspruch behoben:** Kraftwerke jetzt 500 MW (Northern) + 300 MW (Southern) = 800 MW, konsistent mit Technical-Panel und Grid-Abschnitt (vorher 300+200=500 vs. „800 MW combined"; Mitarbeiterzahlen waren als MW übernommen worden).
- ☑ **Investitionstabelle korrigiert:** Storage (€320 M) als Unterposition der €600 M „Grid upgrades and storage" ausgewiesen, Summenzeile €3,0 Mrd. ergänzt (vorher Doppelzählung → scheinbares €320-M-Budgetloch).
- ☑ **Klimaziel-Kaskade vereinheitlicht:** EU 55 % → national 50 % → regional verbindlich 45 % (mit €50-M-Strafen); Environmental fordert 50 % jetzt explizit als politische Forderung, nicht als „Gesetz" (vorher zitierten Government 45 %, Environmental 50 %, Bachelor-Briefing 55 % einander widersprechend als Rechtslage).
- ☑ **Echte Key-Facts-Blätter** für Bachelor und Master erstellt (Kraftwerksdaten, Investitions-Envelope, Grid-Constraints, Rechtsrahmen, Referenzzahlen) — vorher enthielten beide Dateien nur Rollenspiel-Grundregeln und keine einzige Zahl. Die Ground Rules sind in die Simulation-Instructions gewandert; Accordion-Label von „🎭 Staying in Role" auf „📊 Key Facts" geändert (`stakeholders.js`).
- ☑ **Timeline vereinheitlicht:** Bachelor-Briefing sagt jetzt wie Master und Technical „6-7 years; below 5 years risks outages" (vorher 5-7 vs. 6-7).
- ☑ **`\newpage`-LaTeX-Artefakt** aus den Master-Instructions entfernt.

### Nachtrag (Entscheidung 02.08.2026)

- ☑ **Talstadt ist offiziell Bachelor-Niveau:** Level-Label „Standard" → „Bachelor" mit BA-Badge in Session-Übersicht, Session-Dashboard und Facilitator-Materials (Einschätzung Roman, bestätigt: Einsteiger-Planspiel, 2,5 h, explizite Koalitionshinweise — vergleichbar mit ET-Bachelor). Ein späteres Talstadt-Master-Level bleibt als Idee unten gelistet.

---

## Paket 2 — Verhandlungslogik (☐ offen)

| # | Maßnahme | Fall | Prio | KI | Review |
|---|---|---|---|---|---|
| 2.1 | ☐ **No-Deal-Default definieren:** Absatz „If no agreement is reached…" in beide Briefings (z. B. unilaterale Schließung in 10 Jahren mit gesetzlichen Mindestpaketen, Strafen, keine lokalen Zusagen) + je 1 Zeile „Your no-deal outcome" pro Rollenkarte. Ohne Default können Studierende Angebote nicht gegen ihre BATNA bewerten | ET beide | Hoch | ~15 | ~15 |
| 2.2 | ☐ **Bußgeldrahmen** in der Umweltamt-Karte (z. B. „bis 50.000 EUR, wiederholbar") — verhindert Fantasiebeträge | Talstadt | Mittel | ~2 | ~5 |
| 2.3 | ☐ **Wirtschaftszahlen aus dem Original nachziehen:** Gewinn-/Verlustreihen der Fabriken (Papier: +2 Mio → −0,4, laufend −0,6 bis −0,8; Lackier: 1,0–1,8 Mio Gewinne), Gewerbesteuer (160k vs. 500k/320k) in Key Facts §1/§6 — Grundlage für die Subventionsprüfung des Stadtrats | Talstadt | Mittel | ~5 | ~10 |
| 2.4 | ☐ **Bestandsanlagen + Betriebskosten:** Papierfabrik hat bereits mechanische Reinigung (biologische Stufe fehlt), Lackierfabrik hat veraltete Nasswäsche/Filter; laufende Kosten (~150k/Jahr Kläranlage, 100–200k/Jahr Nachverbrennung) in Key Facts §3/§4 | Talstadt | Mittel | ~5 | ~10 |
| 2.5 | ☐ **Technical Panel Verhandlungsmechanik geben:** Finale Agreements brauchen ein „Feasibility Certificate" des Panels (Verweigerung = öffentliches Risiko-Statement) — die Rolle hat sonst nichts zu tauschen | ET beide | Mittel | ~10 | ~10 |
| 2.6 | ☐ **Geld-Übersicht „Where can money come from?":** Einseiter (Contingency, Kreditlinie, Decommissioning↔Restoration-Überlappung), klärt ob Stakeholder-Pakete im €3-Mrd.-Budget stecken — die Geld-ZOPA ist sonst v. a. für Bachelor unsichtbar | ET beide | Mittel | ~10 | ~10 |
| 2.7 | ☐ **Lackierfabrik-Einigungsdruck:** Schornstein als eindeutig anordnungsfähigen Rechtsverstoß in der Amtskarte explizit machen; Hallengenehmigung als Koppelgeschäft beim Stadtrat verankern | Talstadt | Mittel | ~5 | ~5 |
| 2.8 | ☐ **Kleinere Konsistenzfixes ET:** Indigenous-Anteil (90 von 200 Southern = 45 %, nicht „18% of workforce" in der Workers-Karte); Community-Steuerzahlen sauber trennen (€5 M kommunal + €3 M regional = €8 M); €45-M-Payroll auf ~€20 M senken oder als „economic flow incl. multiplier" umbenennen; Skills-Transfer-Zahlen als „union-commissioned study" kennzeichnen; Multiplikator-Wording („2.5 total" vs. „additional"); eine der zwei €50-M-Strafen umbeziffern; Environmental-Constraint „by 2029-2030" physikalisch möglich machen (→ „within 6 years") + Carbon-Budget-Sprache statt „IPCC 2020–2030"; Satz zur fiktiven Verortung (EU-Politik + verfassungsrechtlich anerkannte indigene Rechte); Storage-Preis ~€250 M oder begründen; BrE/AmE vereinheitlichen; Caldecott/Mayer-Zitate ersetzen | ET | Niedrig | ~20 | ~20 |
| 2.9 | ☐ **Fremdenverkehrsverein-Daten:** rückläufige Gäste-/Übernachtungszahlen als Fakt oder Ereigniskarte | Talstadt | Niedrig | ~3 | ~5 |

## Paket 3 — Didaktik & Facilitator (☐ offen)

| # | Maßnahme | Fall | Prio | KI | Review |
|---|---|---|---|---|---|
| 3.1 | ☐ **Ereigniskarten für Energy Transition** (5–6 Karten im Talstadt-Format inkl. Einsatzempfehlungen): Beinahe-Blackout, Rating „negative watch", Vorziehen des Kohleausstiegs, Quecksilber-Medienbericht, EU-Just-Transition-Fördertopf mit Frist, Abwerbung durch Nachbarregion | ET | Hoch | ~20 | ~30 |
| 3.2 | ☐ **Facilitator-Werkzeuge (beide Cases):** Rollenübersicht mit allen roten Linien + ZOPA auf einer Seite; Beobachtungsbogen (Koalitionen, Wendepunkte, Zitate → Rohstoff fürs Debriefing); Common-Problems-Playbook (dominante Gruppe, verweigerte Rolle, zu früher Konsens, Blockade, Eskalation) | Beide | Hoch | ~30 | ~30 |
| 3.3 | ☐ **Bachelor-ET-Debriefing auf 20–25 min** verlängern (aktuell 10 von 100 min), Ablauftabelle anpassen | ET Bachelor | Hoch | ~5 | ~10 |
| 3.4 | ☐ **Reflexionsaufgabe für Talstadt** (600–800 Wörter: Erlebnis → Machtanalyse → Verursacherprinzip/Transfer), analog zur ET-Aufgabe | Talstadt | Hoch | ~10 | ~15 |
| 3.5 | ☐ **Lernziele-Abschnitt** (3–4 Bullets) an den Anfang aller drei Teilnehmer-Guides | Beide | Hoch | ~10 | ~15 |
| 3.6 | ☐ **Talstadt-Konferenz entzerren:** Statements auf 2 min deckeln, 10 min „Konferenzvorbereitung" als eigene Phase; Statement-Reihenfolge des Originals (Beschwerdeführer zuerst: Anglerclub → Fremdenverkehr → Fabriken → Amt → Stadtrat); Spielleitung eröffnet als Bürgermeister:in | Talstadt | Hoch | ~10 | ~10 |
| 3.7 | ☐ **Talstadt-Zusatz-Ereigniskarten** aus dem Original: „Papierfabrik macht überraschend 600.000 EUR Gewinn", „Fischsterben könnte auch an der Hitzewelle liegen" (Kausalitätszweifel), Kaufangebot konkretisiert (8 Mio geboten / 20 Mio Wert / 200 Entlassungen); E4-Frist („heute bis zur Konferenz" statt „2 Wochen") und E6 („unkomplizierte Genehmigungspraxis" statt „ohne Umweltauflagen") umformulieren — aktuell drücken alle Karten nur gegen die Industrie | Talstadt | Mittel | ~15 | ~15 |
| 3.8 | ☐ **Theorieanker in die Bachelor-Debriefings:** BATNA/Reservationspunkt (steckt schon implizit in Best/Acceptable/Avoid), Power/Interest, Verursacherprinzip, externe Kosten, Stakeholder-Salience-Fragen für Talstadt | Beide | Mittel | ~15 | ~20 |
| 3.9 | ☐ **Bewertungsrubrik** für die Reflexionsaufgaben (KPSS-Kompetenzen: Systems/Collaborative/Normative/Critical Thinking) | Beide | Mittel | ~15 | ~20 |
| 3.10 | ☐ **Pre-Reading deklarieren:** Situation Briefing als Hausaufgabe vor der Session (Lesezeit in der Session ist knapp) | Beide | Mittel | ~5 | ~5 |
| 3.11 | ☐ **ET-Konferenzleitung klären:** Facilitator-Nebenrolle (z. B. Energieministerin) benennen; Mentimeter-Setup-Hinweis fürs Facilitator-Material | ET | Mittel | ~5 | ~5 |
| 3.12 | ☐ **Pre/Post-Fragen:** Mentimeter-Prediction um 3–4 Wissens-/Einstellungsfragen vor und nach der Simulation erweitern | Beide | Niedrig | ~10 | ~10 |

## Größere Ideen (Frühjahr 2027 / mit Schritt 3)

- ☐ **Echte Abschlusskonferenz für Energy Transition** als moderierte Entscheidungsarena mit Einigungsmechanismus (Abstimmung über Rahmenabkommen, Protokollbogen) — didaktisch der größte Hebel, braucht Ablauf-Redesign beider Level.
- ☐ **Ereigniskarten-Push über die App:** Facilitator spielt Karte aus, sie erscheint realtime auf den Geräten der betroffenen Gruppen.
- ☐ **Pre/Post-Messung in der App** statt Mentimeter, Auswertung im Facilitator-Dashboard.
- ☐ **Digitale Verhandlungsartefakte** (Protokoll-/Vereinbarungsformulare, Briefe — das Original sieht sie vor, die App unterstützt sie nicht).
- ☐ **Beobachterrolle** für überzählige Teilnehmende (löst zugleich Skalierung großer Kohorten).
- ☐ **Talstadt-Master-Level** aus der nur teilweise verwerteten Original-Infozeitung (M1–M9 in `material/2nd-case/`).

---

## Was gut ist und nicht angefasst werden soll

- **Talstadt:** Zahlenkonsistenz über alle Dateien; Rollenkarten-Struktur (dem Original in der Nutzbarkeit überlegen); CEO-vs-Familienbetrieb-Asymmetrie der Fabriken; die Finanzarchitektur (Zuschuss/Rücklagen/Kosten/Darlehen greifen so ineinander, dass Einigung möglich, aber nicht bequem ist); modernisierte Gesetzesauszüge inkl. Gefährdungshaftung; erweiterte Güteklassen-Tabelle; Einsatzempfehlungen der Ereigniskarten; Debriefing-Vierphasenstruktur.
- **Energy Transition:** Best/Acceptable/Avoid in jeder Karte; enge, aber existente Timeline-ZOPA (~6 Jahre); echte Level-Differenzierung inkl. korrekt auf 6 Gruppen zugeschnittener Bachelor-Docs; Coalition-Dynamics nur im Master (Bachelor soll selbst entdecken); „Useful Phrases" für Non-Natives; 5-Runden-Pairing-Choreographie; Environmental als Brückenbauer; Master-Debriefing mit Salience/Just-Transition/Wicked-Problems.
- **Didaktik:** Briefing–Play–Debrief-Struktur; Losverfahren bei der Rollenvergabe; Ergebnisoffenheit („no agreement is a valid outcome"); Mentimeter-Mapping mit Outcome-Prediction; Reflexionsaufgaben der ET-Level mit Theorie-Transfer.
