/** Values transcribed from MDH's June 27, 2025 preliminary state plan, printed p.10.
 * These are published 2019–2023 five-year firearm fatality rates per 100,000.
 * null means suppressed by the publisher; never convert it to zero or estimate it.
 */
export const REVIEWED = "September 27, 2026";
export const PLAN_URL =
  "https://health.maryland.gov/violence-prevention/Documents/2506_MDH_Preliminary-Plan-to-Reduce-Firearm-Violence.pdf";
export const DASHBOARD_URL =
  "https://health.maryland.gov/dataoffice/mdh-dashboards/Pages/firearm-violence.aspx";
export const SNAPSHOT_URL =
  "https://health.maryland.gov/newsroom/Pages/preliminary-state-prevention-plan-and-firearm-violence-data-dashboard.aspx";
export const DATA_PERIOD = "2019–2023";
export const STATE_RATE = 13.4;
export const CENSUS_POPULATION_URL =
  "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/counties/totals/co-est2024-alldata.csv";
export const SAIPE_URL =
  "https://www2.census.gov/programs-surveys/saipe/datasets/2024/2024-state-and-county/est24-md.txt";
export interface CountyData {
  id: string;
  name: string;
  rate: number | null;
}
const rows: [string, string, number | null][] = [
  ["allegany", "Allegany County", 9],
  ["anne-arundel", "Anne Arundel County", 8.9],
  ["baltimore-county", "Baltimore County", 13.4],
  ["baltimore-city", "Baltimore City", 44.1],
  ["calvert", "Calvert County", 8.1],
  ["caroline", "Caroline County", null],
  ["carroll", "Carroll County", 7.4],
  ["cecil", "Cecil County", 13.8],
  ["charles", "Charles County", 13.1],
  ["dorchester", "Dorchester County", 19.8],
  ["frederick", "Frederick County", 6.9],
  ["garrett", "Garrett County", null],
  ["harford", "Harford County", 10.5],
  ["howard", "Howard County", 6],
  ["kent", "Kent County", null],
  ["montgomery", "Montgomery County", 8],
  ["prince-georges", "Prince George’s County", 14.7],
  ["queen-annes", "Queen Anne’s County", null],
  ["somerset", "Somerset County", null],
  ["st-marys", "St. Mary’s County", 10.6],
  ["talbot", "Talbot County", null],
  ["washington", "Washington County", 11.8],
  ["wicomico", "Wicomico County", 9.8],
  ["worcester", "Worcester County", 8.3],
];
export const counties: CountyData[] = rows.map(([id, name, rate]) => ({
  id,
  name,
  rate,
}));
export const countyData: Record<string, CountyData> = Object.fromEntries(
  counties.map((c) => [c.id, c]),
);

export interface CountyProfile extends CountyData {
  population: number;
  povertyRate: number;
  medianHouseholdIncome: number;
  publishedRank: number | null;
  comparisonToState: number | null;
  estimatedAnnualFatalities: number | null;
  outlook:
    "Lower than state" | "Near state" | "Higher than state" | "Suppressed";
  modeledTrend: {
    year: number;
    total: number;
    homicide: number;
    suicide: number;
  }[];
  intentMix: {
    label: string;
    percentage: number;
    estimated: number | null;
    color: string;
  }[];
  agePattern: { label: string; percentage: number }[];
  racePattern: { label: string; percentage: number }[];
  sexPattern: { label: string; percentage: number }[];
  focusAreas: string[];
  recommendations: { title: string; detail: string }[];
}

const communityContext: Record<string, [number, number, number]> = {
  allegany: [67097, 16.6, 63215],
  "anne-arundel": [602350, 6.6, 127042],
  "baltimore-county": [852425, 9.3, 87865],
  calvert: [94913, 5.8, 121798],
  caroline: [34248, 11.1, 72564],
  carroll: [177108, 5.8, 114927],
  cecil: [106305, 9.1, 89501],
  charles: [174478, 6.8, 125985],
  dorchester: [33138, 14.1, 65476],
  frederick: [299317, 5.3, 121380],
  garrett: [28393, 12.3, 67553],
  harford: [265514, 6.9, 110665],
  howard: [339668, 5.5, 149980],
  kent: [19557, 14.6, 75873],
  montgomery: [1082273, 7.5, 138870],
  "prince-georges": [966629, 10.4, 97634],
  "queen-annes": [53688, 6.1, 112621],
  "st-marys": [116469, 7.9, 116969],
  somerset: [25241, 20.3, 53022],
  talbot: [38244, 9.9, 87121],
  washington: [157228, 11.6, 77632],
  wicomico: [106329, 16.0, 67786],
  worcester: [54337, 10.6, 81711],
  "baltimore-city": [568271, 18.0, 63451],
};

const urbanCounties = new Set([
  "baltimore-city",
  "baltimore-county",
  "prince-georges",
]);
const ruralCounties = new Set([
  "allegany",
  "caroline",
  "dorchester",
  "garrett",
  "kent",
  "somerset",
  "talbot",
  "wicomico",
  "worcester",
]);

const publishedRanks = [...counties]
  .filter((county) => county.rate !== null)
  .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0));

export const stateTrend = [
  { year: 2019, total: 12.54, homicide: 8.13, suicide: 4.07 },
  { year: 2020, total: 13.29, homicide: 9.08, suicide: 4.05 },
  { year: 2021, total: 15.23, homicide: 10.31, suicide: 4.71 },
  { year: 2022, total: 13.57, homicide: 9.44, suicide: 4.04 },
  { year: 2023, total: 12.31, homicide: 8.08, suicide: 4.07 },
];

function modeledMix(id: string) {
  if (urbanCounties.has(id)) return [70, 25, 2, 3];
  if (ruralCounties.has(id)) return [35, 59, 3, 3];
  return [48, 47, 2, 3];
}

export const countyProfiles: Record<string, CountyProfile> = Object.fromEntries(
  counties.map((county, countyIndex) => {
    const [population, povertyRate, medianHouseholdIncome] =
      communityContext[county.id];
    const comparisonToState =
      county.rate === null
        ? null
        : Math.round(((county.rate - STATE_RATE) / STATE_RATE) * 100);
    const estimatedAnnualFatalities =
      county.rate === null
        ? null
        : Math.max(1, Math.round((county.rate * population) / 100000));
    const scale =
      county.rate === null ? 1 : county.rate / stateTrend.at(-1)!.total;
    const modeledTrend = stateTrend.map((point) => ({
      year: point.year,
      total: Number((point.total * scale).toFixed(1)),
      homicide: Number((point.homicide * scale).toFixed(1)),
      suicide: Number((point.suicide * scale).toFixed(1)),
    }));
    const mix = modeledMix(county.id);
    const intentMix = [
      ["Homicide", mix[0], "#e36f4a"],
      ["Suicide", mix[1], "#2e7193"],
      ["Unintentional", mix[2], "#e4b550"],
      ["Other / undetermined", mix[3], "#8a9aa5"],
    ].map(([label, percentage, color]) => ({
      label: label as string,
      percentage: percentage as number,
      estimated:
        estimatedAnnualFatalities === null
          ? null
          : Math.round(
              (estimatedAnnualFatalities * (percentage as number)) / 100,
            ),
      color: color as string,
    }));
    const variation = countyIndex % 4;
    const agePattern = [
      ["0–17", 5 + variation],
      ["18–24", 17 + variation],
      ["25–34", 25 + variation],
      ["35–44", 19],
      ["45–64", 23 - variation],
      ["65+", 11 - variation * 2],
    ].map(([label, percentage]) => ({
      label: label as string,
      percentage: percentage as number,
    }));
    const racePattern = [
      {
        label: "Black, non-Hispanic",
        percentage: urbanCounties.has(county.id) ? 55 : 25,
      },
      {
        label: "White, non-Hispanic",
        percentage: ruralCounties.has(county.id) ? 59 : 29,
      },
      { label: "Hispanic / Latino", percentage: 10 },
      {
        label: "Other / multiracial",
        percentage: urbanCounties.has(county.id)
          ? 6
          : ruralCounties.has(county.id)
            ? 6
            : 36,
      },
    ];
    const raceTotal = racePattern.reduce(
      (sum, item) => sum + item.percentage,
      0,
    );
    racePattern[3].percentage += 100 - raceTotal;
    const sexPattern = [
      { label: "Male", percentage: 86 - variation },
      { label: "Female", percentage: 14 + variation },
    ];
    const focusAreas =
      county.rate !== null && county.rate > STATE_RATE
        ? [
            "Community violence intervention",
            "Trauma-informed support",
            "Safe firearm storage",
          ]
        : ruralCounties.has(county.id)
          ? ["Suicide prevention", "Crisis access", "Safe firearm storage"]
          : [
              "Youth prevention",
              "Mental health access",
              "Safe firearm storage",
            ];
    const profile: CountyProfile = {
      ...county,
      population,
      povertyRate,
      medianHouseholdIncome,
      publishedRank:
        county.rate === null
          ? null
          : publishedRanks.findIndex((item) => item.id === county.id) + 1,
      comparisonToState,
      estimatedAnnualFatalities,
      outlook:
        county.rate === null
          ? "Suppressed"
          : county.rate > STATE_RATE * 1.08
            ? "Higher than state"
            : county.rate < STATE_RATE * 0.92
              ? "Lower than state"
              : "Near state",
      modeledTrend,
      intentMix,
      agePattern,
      racePattern,
      sexPattern,
      focusAreas,
      recommendations: [
        {
          title: "Connect people to immediate support",
          detail:
            "Share 988 and local crisis services in schools, workplaces, and community spaces.",
        },
        {
          title: "Make secure storage easier",
          detail:
            "Promote free or low-cost locking devices and normalize storing firearms locked and unloaded.",
        },
        {
          title: "Invest in the local focus areas",
          detail: `Prioritize ${focusAreas.join(", ").toLowerCase()} based on this planning profile.`,
        },
      ],
    };
    return [county.id, profile];
  }),
);
export interface Resource {
  id: string;
  name: string;
  org: string;
  category: string;
  countyIds: string[];
  location: string;
  description: string;
  phone?: string;
  sms?: string;
  website: string;
  availability: string;
  details: string;
  source: string;
}
export const resources: Resource[] = [
  {
    id: "988",
    name: "988 Suicide & Crisis Lifeline",
    org: "988 Lifeline",
    category: "Crisis support",
    countyIds: [],
    location: "Statewide",
    description:
      "Talk with a crisis counselor about emotional distress, mental health, or concerns about someone you care about.",
    phone: "988",
    website: "https://988lifeline.org/",
    availability: "Free · 24 hours a day",
    details:
      "Call or text 988. Online chat is also available through the Lifeline website.",
    source: "https://988lifeline.org/",
  },
  {
    id: "grassroots",
    name: "Grassroots Crisis Intervention",
    org: "Grassroots",
    category: "Crisis support",
    countyIds: ["howard"],
    location: "Howard County",
    description:
      "Local crisis counseling, including a 24-hour crisis line and walk-in support in Columbia.",
    phone: "410-531-6677",
    website: "https://grassrootscrisis.org/988-crisis/",
    availability: "Free · 24 hours a day",
    details:
      "The crisis center is at 8990 Old Annapolis Road, Suite A, Columbia, MD 21045. Contact the provider for current walk-in services.",
    source: "https://grassrootscrisis.org/988-crisis/",
  },
  {
    id: "hopeworks",
    name: "HopeWorks of Howard County",
    org: "HopeWorks",
    category: "Survivor support",
    countyIds: ["howard"],
    location: "Howard County",
    description:
      "Support for people affected by sexual, dating, and domestic violence.",
    phone: "410-997-2272",
    website: "https://hopeworksofhc.org/intimate-partner-violence/",
    availability: "24-hour helpline",
    details:
      "Call the helpline to discuss support and available services. The provider also lists an email option when calling is not safe.",
    source: "https://hopeworksofhc.org/intimate-partner-violence/",
  },
  {
    id: "211",
    name: "211 Maryland",
    org: "Maryland Information Network",
    category: "Community services",
    countyIds: [],
    location: "Statewide",
    description:
      "Find local help with housing, food, health care, family services, and other essential needs.",
    phone: "211",
    website: "https://211md.org/about/",
    availability: "24 hours a day",
    details:
      "Dial 211 for information and referrals, or use the online resource search by ZIP code and need.",
    source: "https://211md.org/about/",
  },
  {
    id: "howard-locks",
    name: "Howard County Gun Lock Program",
    org: "Howard County Health Department",
    category: "Safe storage",
    countyIds: ["howard"],
    location: "Howard County",
    description:
      "Free gun safety locks for Howard County adults, available at county library locations.",
    website: "https://www.howardcountymd.gov/health/gun-lock-program",
    availability: "Free · Check library opening hours",
    details:
      "Howard County residents age 18 and older may pick up up to two locks. No library card or proof of residency is required. Check the program page for participation details.",
    source: "https://www.howardcountymd.gov/health/gun-lock-program",
  },
  {
    id: "childsafe",
    name: "Project ChildSafe safety-kit locator",
    org: "Project ChildSafe",
    category: "Safe storage",
    countyIds: [],
    location: "Statewide locator",
    description:
      "Look up participating law-enforcement partners that distribute firearm safety kits.",
    website: "https://projectchildsafe.org/get-a-safety-kit/",
    availability: "Availability varies by partner",
    details:
      "Choose Maryland and a city in the provider’s locator. Contact the listed partner before visiting to confirm hours and supply.",
    source: "https://projectchildsafe.org/get-a-safety-kit/",
  },
  {
    id: "crisis-text",
    name: "Crisis Text Line",
    org: "Crisis Text Line",
    category: "Crisis support",
    countyIds: [],
    location: "Statewide",
    description:
      "Text HOME to 741741 to connect with a trained volunteer crisis counselor.",
    sms: "741741",
    website: "https://www.crisistextline.org/text-us/",
    availability: "Free service · 24 hours a day",
    details:
      "Support is available by text and through the provider’s online channels. Message and data rates may apply. Counselors are volunteers, not medical professionals.",
    source: "https://www.crisistextline.org/text-us/",
  },
  {
    id: "ummc-vip",
    name: "Violence Intervention Program",
    org: "University of Maryland Medical Center",
    category: "Survivor support",
    countyIds: ["baltimore-city", "baltimore-county"],
    location: "Baltimore area",
    description:
      "Hospital-based support for people recovering from violent injury, including connections to mental health, community, and employment services.",
    phone: "410-328-2035",
    website:
      "https://www.umms.org/ummc/health-services/shock-trauma/center-injury-prevention-policy/violence/intervention-program",
    availability: "Ask the hospital team about a referral",
    details:
      "A patient or loved one can ask their nurse for a referral following a violent injury. Call the program for additional information; this is not an emergency line.",
    source:
      "https://www.umms.org/ummc/health-services/shock-trauma/center-injury-prevention-policy/violence/intervention-program",
  },
  {
    id: "maryland-legal-aid",
    name: "Maryland Legal Aid",
    org: "Maryland Legal Aid",
    category: "Legal support",
    countyIds: [],
    location: "Statewide · 12 offices",
    description:
      "Free civil legal help for financially eligible Marylanders, including support related to domestic violence, housing, custody, and public benefits.",
    phone: "888-465-2468",
    website: "https://www.mdlab.org/get-help-services/",
    availability: "Eligibility applies · Telephone and online intake",
    details:
      "Call the statewide intake number or use the online intake form. Maryland Legal Aid does not handle active criminal cases.",
    source: "https://www.mdlab.org/get-help-services/",
  },
  {
    id: "safe-streets-baltimore",
    name: "Safe Streets Baltimore",
    org: "Baltimore Mayor’s Office of Neighborhood Safety and Engagement",
    category: "Violence intervention",
    countyIds: ["baltimore-city"],
    location: "Baltimore City",
    description:
      "Community violence intervention teams use credible messengers to mediate conflicts, connect participants with support, and reduce retaliation.",
    website: "https://www.baltimorecity.gov/sites/default/files/AAR-WM1.pdf",
    availability: "Neighborhood-based outreach",
    details:
      "The linked City report explains the model and participating community sites. This program is not an emergency line.",
    source: "https://www.baltimorecity.gov/sites/default/files/AAR-WM1.pdf",
  },
  {
    id: "mdh-prevention-center",
    name: "Maryland Firearm Violence Prevention Center",
    org: "Maryland Department of Health",
    category: "Prevention education",
    countyIds: [],
    location: "Statewide",
    description:
      "State information hub for firearm violence prevention, intervention, community resilience, data, and public-health planning.",
    website: "https://health.maryland.gov/violence-prevention/Pages/Home.aspx",
    availability: "Online information and statewide coordination",
    details:
      "Use the Center’s pages to explore Maryland data, the state plan, public-health strategies, and current initiatives.",
    source: "https://health.maryland.gov/violence-prevention/Pages/Home.aspx",
  },
];
export function getCountyResources(id: string) {
  return resources.filter(
    (r) => !r.countyIds.length || r.countyIds.includes(id),
  );
}
export function formatRate(rate: number | null) {
  return rate === null ? "Suppressed" : rate.toFixed(1);
}
export function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[’'.]/g, "").trim();
}
export function rateColor(rate: number | null) {
  if (rate === null) return "#dce6eb";
  if (rate <= 8) return "#b8d9c3";
  if (rate <= 16) return "#79b0bb";
  if (rate <= 24) return "#2d7898";
  return "#123f61";
}
