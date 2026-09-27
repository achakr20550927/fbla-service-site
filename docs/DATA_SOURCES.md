# Data provenance and review notes

Reviewed September 27, 2026.

## County firearm fatality rates

Publisher: Maryland Department of Health, Center for Firearm Violence Prevention and Intervention.
Publication: _Preliminary State Plan for a Public Health Approach to Reducing Firearm Violence_, June 27, 2025.
URL: https://health.maryland.gov/violence-prevention/Documents/2506_MDH_Preliminary-Plan-to-Reduce-Firearm-Violence.pdf

- Printed p.10 / PDF p.13: 2019–2023 five-year overall firearm fatality rates per 100,000 by jurisdiction. Values visually transcribed from the map, not inferred from color bands.
- Printed p.9 / PDF p.12: Maryland five-year rate 13.4.
- Printed p.12 / PDF p.15: annual statewide total/homicide/suicide rates, 2019–2023.
- General source: CDC WISQARS accessed April 2025; county footnote also cites CDC WONDER.
- Suppression: preserve the six suppressed overall county rates as null. The report describes suppression for fatality counts under 20.
- Published rates remain separate from all derived and modeled fields.
- Preserve the published values even where independently recomputing them might produce different results; resolve questions against the publisher before changing them.

## 2024 county community context

Population publisher: U.S. Census Bureau, Population Estimates Program.
Source file: https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/counties/totals/co-est2024-alldata.csv

Poverty and household income publisher: U.S. Census Bureau, Small Area Income and Poverty Estimates.
Source file: https://www2.census.gov/programs-surveys/saipe/datasets/2024/2024-state-and-county/est24-md.txt

The report uses 2024 population estimates, poverty percentages, and median household income. Community context does not establish causation and is not incorporated into a risk score.

## Modeled report previews

The richer county interface includes deliberately labeled preview values for estimated annual fatalities, county trend histories, nonfatal injuries, youth deaths, intent mix, age, race/ethnicity, and sex. Published-rate-derived annual fatalities remain unavailable for counties whose rate is suppressed. The ten-year explorer uses a transparent interface model with county-specific variation around a Maryland-shaped pattern; suppressed counties retain a design preview that is not derived from the hidden rate. Distribution panels are interface placeholders based on broad urban, suburban, and rural profiles.

These previews are not observed county findings. They are labeled “Modeled preview” in the interface and must be replaced with official Maryland dashboard exports before being cited in a presentation, report, or policy decision.

## 2024 statewide snapshot

Source: MDH announcement, https://health.maryland.gov/newsroom/Pages/preliminary-state-prevention-plan-and-firearm-violence-data-dashboard.aspx

671 firearm fatalities and 780 nonfatal firearm-injury emergency department visits in Maryland in 2024. These are different measures and are not combined. They are distinct from the county map’s 2019–2023 period.

Live publisher dashboard: https://health.maryland.gov/dataoffice/mdh-dashboards/Pages/firearm-violence.aspx

The application itself is a reviewed static snapshot, not a live data integration.

## County geometry

State of Maryland, MD iMAP / SHA / DoIT:
https://mdgeodata.md.gov/imap/rest/services/Boundaries/MD_PhysicalBoundaries/FeatureServer/1

Query: `where=1=1`, `outFields=county,county_fip`, `outSR=3857`, `maxAllowableOffset=350`, `f=geojson`. Download the response, then run `python3 scripts/build-boundaries.py PATH_TO_GEOJSON` from the repository root. Projection coordinates are uniformly scaled into SVG paths. Metadata and attribution remain in the generated JSON. These generalized boundaries are not suitable for surveying.

## Provider directory

Each resource has its own source URL in `src/lib/data.ts`. Sources are the actual service providers or responsible government programs, including 988 Lifeline, Grassroots, HopeWorks, 211 Maryland, Howard County Health Department, Project ChildSafe, Crisis Text Line, University of Maryland Medical Center, Maryland Legal Aid, Safe Streets Baltimore, and the Maryland firearm violence prevention center. Contacts and service descriptions were checked against provider or government pages. No effectiveness score or formal partnership is implied. Stock and hours should be reconfirmed by visitors.

## ZIP lookup limitation

The inherited project ZIP mapping has not been independently validated as a boundary crosswalk. ZIPs are postal delivery areas and can cross counties. The UI presents results as suggestions and offers a complete county list. Unmapped ZIPs are not silently assigned by numerical range.
