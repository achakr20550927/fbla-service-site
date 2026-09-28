import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  counties,
  countyData,
  resources,
  getCountyResources,
  formatRate,
  normalizeSearch,
  stateTrend,
  countyProfiles,
} from "../src/lib/data.ts";
import {
  getCountyByZipcode,
  isMarylandZipcode,
  mdZipcodes,
} from "../src/lib/zipcodes.ts";
const boundaries = JSON.parse(
  readFileSync(new URL("../src/data/boundaries.json", import.meta.url)),
);

test("all 24 Maryland jurisdictions have matching, nonempty map geometry", () => {
  assert.equal(counties.length, 24);
  assert.equal(new Set(counties.map((c) => c.id)).size, 24);
  assert.deepEqual(
    new Set(boundaries.counties.map((c) => c.id)),
    new Set(counties.map((c) => c.id)),
  );
  for (const county of boundaries.counties) assert.match(county.path, /^M.+Z$/);
});
test("every county profile contains official context and labeled model inputs", () => {
  assert.equal(Object.keys(countyProfiles).length, 24);
  for (const county of counties) {
    const profile = countyProfiles[county.id];
    assert.ok(profile.population > 19000);
    assert.ok(profile.povertyRate > 0 && profile.povertyRate < 25);
    assert.ok(profile.medianHouseholdIncome > 50000);
    assert.equal(
      profile.agePattern.reduce((sum, item) => sum + item.percentage, 0),
      100,
    );
    assert.equal(
      profile.racePattern.reduce((sum, item) => sum + item.percentage, 0),
      100,
    );
    assert.equal(
      profile.sexPattern.reduce((sum, item) => sum + item.percentage, 0),
      100,
    );
    assert.equal(
      profile.intentMix.reduce((sum, item) => sum + item.percentage, 0),
      100,
    );
    assert.equal(profile.modeledTrend.length, 10);
    assert.deepEqual(
      profile.modeledTrend.map((point) => point.year),
      [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    );
    for (const point of profile.modeledTrend) {
      assert.ok(point.total > 0);
      assert.ok(point.nonfatal > 0);
      assert.ok(point.fatalityCount > 0);
      assert.ok(point.nonfatalCount > 0);
    }
  }
  assert.equal(countyProfiles.howard.population, 339668);
  assert.equal(countyProfiles["baltimore-city"].povertyRate, 18);
  assert.ok(countyProfiles.caroline.estimatedAnnualFatalities > 0);
  assert.notDeepEqual(
    countyProfiles.howard.modeledTrend.map((point) => point.total),
    countyProfiles.montgomery.modeledTrend.map((point) => point.total),
  );
});
test("all counties display a rate and legacy fallbacks remain identifiable", () => {
  assert.equal(
    counties.every((c) => typeof c.rate === "number" && c.rate > 0),
    true,
  );
  assert.deepEqual(
    Object.fromEntries(
      counties
        .filter((c) => c.rateOrigin === "legacy")
        .map((c) => [c.id, c.rate]),
    ),
    {
      caroline: 6.3,
      garrett: 2.1,
      kent: 2.8,
      "queen-annes": 3.9,
      somerset: 16.1,
      talbot: 4.2,
    },
  );
  assert.equal(formatRate(null), "Suppressed");
  assert.equal(countyData.howard.rate, 6);
  assert.equal(countyData["baltimore-city"].rate, 44.1);
  assert.equal(
    counties.some((c) => c.rate === 0),
    false,
  );
  assert.deepEqual(
    stateTrend.map((d) => d.total),
    [12.54, 13.29, 15.23, 13.57, 12.31],
  );
});
test("resources have real URLs, numeric contact methods and valid county IDs", () => {
  assert.equal(new Set(resources.map((r) => r.id)).size, resources.length);
  for (const r of resources) {
    for (const url of [r.website, r.source]) {
      assert.equal(new URL(url).protocol, "https:");
      assert.notEqual(new URL(url).hostname, "#");
    }
    if (r.phone) assert.match(r.phone, /^(?:988|211|\d{3}-\d{3}-\d{4})$/);
    if (r.sms) assert.match(r.sms, /^\d+$/);
    for (const id of r.countyIds) assert.ok(countyData[id]);
  }
});
test("county selection includes statewide help without leaking unrelated local services", () => {
  const howard = getCountyResources("howard").map((r) => r.id);
  assert.ok(howard.includes("hopeworks"));
  assert.ok(howard.includes("988"));
  assert.ok(howard.includes("howard-locks"));
  assert.ok(!howard.includes("ummc-vip"));
  const garrett = getCountyResources("garrett").map((r) => r.id);
  assert.ok(garrett.includes("988"));
  assert.ok(!garrett.includes("hopeworks"));
});
test("ZIP lookup rejects unmapped or malformed codes and maps to existing counties", () => {
  assert.equal(getCountyByZipcode("21042"), "howard");
  assert.equal(getCountyByZipcode("99999"), null);
  assert.equal(isMarylandZipcode("20600"), false);
  assert.equal(isMarylandZipcode("21042abc"), false);
  for (const id of Object.values(mdZipcodes)) assert.ok(countyData[id]);
});
test("county search handles straight and curly apostrophes consistently", () => {
  assert.equal(
    normalizeSearch("Prince George's"),
    normalizeSearch("Prince George’s"),
  );
  assert.ok(
    normalizeSearch("St. Mary’s County").includes(normalizeSearch("St Mary's")),
  );
});
