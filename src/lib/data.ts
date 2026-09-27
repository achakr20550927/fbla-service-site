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
export const stateTrend = [
  { year: 2019, total: 12.54, homicide: 8.13, suicide: 4.07 },
  { year: 2020, total: 13.29, homicide: 9.08, suicide: 4.05 },
  { year: 2021, total: 15.23, homicide: 10.31, suicide: 4.71 },
  { year: 2022, total: 13.57, homicide: 9.44, suicide: 4.04 },
  { year: 2023, total: 12.31, homicide: 8.08, suicide: 4.07 },
];
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
  if (rate === null) return "#e6e8e5";
  if (rate <= 8) return "#f4d9bd";
  if (rate <= 16) return "#db9a66";
  if (rate <= 24) return "#ba6036";
  return "#753723";
}
