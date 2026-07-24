---
title: What actually goes into testing a battery cell
date: 2026-07-24
---

Most people only think about a battery when it fails — the phone that won't
hold a charge, the EV whose range keeps shrinking. What almost nobody sees is
the testing that happens long before that: the process that decides whether
a cell is safe to sit in your pocket or your car in the first place.

## It's a check-up, not a single test

Battery testing tracks the same handful of vital signs, over and over: how
much energy a cell can hold, how fast it gives that energy up, and how many
charge cycles it survives before capacity meaningfully declines. What makes
it complicated is everything that can move those numbers — temperature,
charging behavior, mechanical stress, or just time on a shelf.

It's also not only about performance. As battery fires and safety incidents
have drawn more attention, testing has become the industry's main
quality-control mechanism — the line between "meets spec" and "actually
safe to ship."

## Chemistry and form factor set the ground rules

| Chemistry | Strength | Common use |
|---|---|---|
| LCO | High energy density | Phones, laptops |
| LMO | Stable, low cost | Power tools, some EVs |
| LFP | Thermal stability, long life | Stationary storage, EVs |
| NCA | High energy density | EVs (high power output) |
| NMC | Balanced density/life/power | EVs, stationary storage |
| LTO | Very fast charge/discharge | EV buses, grid storage |

| Form factor | Typical use | Tradeoff |
|---|---|---|
| Cylindrical (18650, 21700, 4680) | Laptops, power tools, EVs | High energy density, mature manufacturing |
| Prismatic | Phones, tablets | Higher density, shorter cycle life, pricier |
| Pouch | Drones, wearables | Lightest, most flexible, lower density |
| Large-format | EV packs, grid storage | Scales up prismatic/pouch designs |

## Fixtures and temperature come first

A lot of testing rigor is really about the hardware that holds a cell in
place. Depending on the goal, that might be an electrical contact fixture
(spring-loaded probes for cell testing), an environmental chamber fixture
(temperature/humidity control), a mechanical stress fixture (crush, drop,
bend), or a safety containment fixture built to handle thermal runaway
without becoming a hazard itself.

Temperature measurement runs through nearly every test:

| Method | Best for |
|---|---|
| Thermocouples | Cheap, fast, wide range — the default choice |
| RTDs | Higher precision when the setup allows |
| Thermal imaging | Non-contact; best for spotting hotspots across a pack |

## One charge/discharge cycle, visually

The most common charging protocol in commercial lithium-ion cells is
**CC-CV**: constant current until the cell hits a cutoff voltage, then
constant voltage while current tapers off. Discharge is typically just
constant current. Here's what one full cycle looks like:

![One CC-CV charge and CC discharge cycle, showing voltage rising during constant-current charge, holding flat during constant-voltage charge while current tapers, then discharging at constant current](posts/assets/cc-cv-cycle.png)

Simple in concept, but the balance between charge speed and long-term
capacity retention is where a lot of real engineering tradeoffs live.

## The core tests, at a glance

| Test | What it tells you |
|---|---|
| Differential voltage analysis (dV/dQ) | Electrochemical "fingerprint"; flags electrode degradation early |
| OCV-SOC characterization | Maps voltage to state of charge — backbone of SOC estimation |
| CC-CV charging | Standard charge protocol; balances speed vs. retention |
| Drive cycle testing (UDDS, WLTC, NEDC, CLTC) | Simulates real-world driving to estimate EV range |
| Calendar aging | Degradation from time/temperature/SOC alone, no cycling |
| EIS | AC-signal diagnostic for internal resistance, charge transfer, diffusion |

## Safety testing isn't optional

This is the part closest to my own day-to-day work.

| Standard | Covers |
|---|---|
| UN 38.3 | Safe transport |
| IEC 62133 | Portable cell/battery safety |
| UL 1642 | Cell and battery safety (electrical, mechanical, environmental) |
| IEC 62619 | Secondary batteries in energy storage systems |

Abuse testing is where cells get pushed to their actual limits: overcharge,
overdischarge, short circuit, crush, nail penetration, thermal cycling, and
external heating tests that simulate fire propagation through a module.
"Works under normal conditions" isn't the same claim as "safe" — abuse
testing is what closes that gap.

## Where testing is headed

AI/ML is increasingly used to sift through the volume of data these tests
generate — spotting degradation patterns and predicting remaining useful
life faster than manual analysis. Digital twins — virtual models of a
physical cell — are starting to let engineers explore designs in simulation
before committing to physical prototypes. Neither replaces physical
testing (a simulation is only as good as the data used to validate it), but
both are changing how much physical testing is needed to get a confident
answer.

## The takeaway

Battery testing rarely gets attention outside the industry, but it's the
reason a battery claim on a spec sheet is trustworthy at all. Every number
you see — capacity, cycle life, range, safety rating — traces back to a
fixture, a protocol, and someone running the same test enough times to be
sure.
