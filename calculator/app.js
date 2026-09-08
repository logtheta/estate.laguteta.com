const STORAGE_KEY = "house-sale-calculator:v3";
const LEGACY_STORAGE_KEYS = ["house-sale-calculator:v1", "house-sale-calculator:v2"];
const APP_SCHEMA_VERSION = 3;

const FEDERAL_LTCG_2026 = {
  married: { zero: 98900, fifteen: 613700 },
  single: { zero: 49450, fifteen: 545500 },
};

const NIIT_THRESHOLDS = {
  married: 250000,
  single: 200000,
};

const CA_2025_BRACKETS = {
  married: [
    { over: 0, base: 0, rate: 0.01 },
    { over: 22158, base: 221.58, rate: 0.02 },
    { over: 52528, base: 828.98, rate: 0.04 },
    { over: 82904, base: 2044.02, rate: 0.06 },
    { over: 115084, base: 3974.82, rate: 0.08 },
    { over: 145448, base: 6403.94, rate: 0.093 },
    { over: 742958, base: 61972.37, rate: 0.103 },
    { over: 891542, base: 77276.52, rate: 0.113 },
    { over: 1485906, base: 144439.65, rate: 0.123 },
  ],
  single: [
    { over: 0, base: 0, rate: 0.01 },
    { over: 11079, base: 110.79, rate: 0.02 },
    { over: 26264, base: 414.49, rate: 0.04 },
    { over: 41452, base: 1022.01, rate: 0.06 },
    { over: 57542, base: 1987.41, rate: 0.08 },
    { over: 72724, base: 3201.97, rate: 0.093 },
    { over: 371479, base: 30986.19, rate: 0.103 },
    { over: 445771, base: 38638.27, rate: 0.113 },
    { over: 742953, base: 72219.84, rate: 0.123 },
  ],
};

const DEFAULT_STATE = {
  schemaVersion: APP_SCHEMA_VERSION,
  sellingPrice: 1500000,
  purchasePrice: 1100000,
  downPayment: 710000,
  sellerRealtorPct: 2.5,
  buyerRealtorPct: 2.5,
  mortgagePayoff: 320000,
  closingCosts: 0,
  otherIncome: 250000,
  purchaseMonth: "2019-06",
  saleMonth: "2027-06",
  monthlyHousingPayment: 3100,
  annualPropertyTax: 15000,
  annualInsurance: 1200,
  filingStatus: "married",
  qualifiesForExclusion: true,
  useCaliforniaTax: true,
  costs: [
    { id: createId(), description: "A/C", cost: 11000, basis: true },
    { id: createId(), description: "Kitchen remodeling", cost: 11000, basis: true },
    { id: createId(), description: "Pool removal", cost: 22000, basis: true },
    { id: createId(), description: "Patio", cost: 2000, basis: true },
    { id: createId(), description: "A/C tune-up", cost: 2000, basis: false },
    { id: createId(), description: "Roof", cost: 17300, basis: true },
    { id: createId(), description: "Siding", cost: 9000, basis: true },
    { id: createId(), description: "Paint in/out", cost: 11000, basis: false },
    { id: createId(), description: "Front/back yard", cost: 8500, basis: true },
    { id: createId(), description: "New door + installation", cost: 2000, basis: true },
  ],
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

let state = loadState();

const fields = document.querySelectorAll("[data-field]");
const costList = document.querySelector("#costList");
const savedState = document.querySelector("#savedState");
const VALUE_TONES = {
  heroNet: "signed",
  netCash: "signed",
  netCashDetail: "signed",
  economicProfit: "signed",
  economicProfitDetail: "signed",
  heroProfit: "signed",
  cashBeforeTax: "signed",
  rawGain: "signed",
  amountRealized: "benefit",
  gainBeforeExclusion: "signed",
  exclusionApplied: "benefit",
  mortgagePayoff: "cost",
  downPayment: "cost",
  totalCashInvested: "cost",
  totalMonthlyPayments: "cost",
  propertyTaxPaid: "cost",
  insurancePaid: "cost",
  mortgagePaymentPortion: "cost",
  ownershipCost: "cost",
  allTrackedCosts: "cost",
  totalOwnershipCost: "cost",
  sellerRealtorFee: "cost",
  buyerRealtorFee: "cost",
  realtorFees: "cost",
  sellingExpenses: "cost",
  closingCosts: "cost",
  basisCosts: "cost",
  adjustedBasis: "cost",
  taxableGain: "taxBase",
  taxableGainDetail: "taxBase",
  totalTax: "cost",
  federalTax: "cost",
  niitTax: "cost",
  californiaTax: "cost",
};

function loadState() {
  const saved = readStoredState(STORAGE_KEY) || readLegacyState();
  if (saved) {
    return normalizeState(saved);
  }
  return createDefaultState();
}

function saveState() {
  state = normalizeState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  savedState.textContent = "Saved";
}

function readStoredState(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

function readLegacyState() {
  for (const key of [...LEGACY_STORAGE_KEYS].reverse()) {
    const saved = readStoredState(key);
    if (saved) return saved;
  }
  return null;
}

function createDefaultState() {
  return normalizeState(structuredClone(DEFAULT_STATE));
}

function normalizeState(source) {
  const defaults = structuredClone(DEFAULT_STATE);
  const next = {
    ...defaults,
    ...source,
    schemaVersion: APP_SCHEMA_VERSION,
    costs: Array.isArray(source?.costs) ? source.costs : defaults.costs,
  };

  next.costs = next.costs.map((item) => ({
    id: item.id || createId(),
    description: item.description == null ? "Improvement" : String(item.description),
    cost: toNumber(item.cost),
    basis: Boolean(item.basis),
  }));

  return next;
}

function toNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value || "").replace(/[$,%\s,]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatInput(value) {
  if (!value) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function money(value) {
  return currency.format(Math.round(value || 0));
}

function percent(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function displayValue(value, id) {
  if (typeof value !== "number") return value;
  const absMoney = money(Math.abs(value));
  if (value === 0) return money(0);
  if (VALUE_TONES[id] === "cost" && value > 0) return `-${absMoney}`;
  return money(value);
}

function clampZero(value) {
  return Math.max(0, value);
}

function applyValueClass(element, value, id) {
  element.classList.remove("value-positive", "value-negative", "value-neutral");
  if (typeof value !== "number") return;

  element.classList.add(valueClass(value, id));
}

function valueClass(value, id) {
  const tone = VALUE_TONES[id] || "signed";
  if (tone === "taxBase" && value > 0) return "value-negative";
  const directionalValue = tone === "cost" ? -value : value;

  if (directionalValue > 0) {
    return "value-positive";
  }
  if (directionalValue < 0) return "value-negative";
  return "value-neutral";
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function monthIndex(value) {
  const [year, month] = String(value || "").split("-").map(Number);
  if (!year || !month) return null;
  return year * 12 + month - 1;
}

function monthsBetween(start, end) {
  const startIndex = monthIndex(start);
  const endIndex = monthIndex(end);
  if (startIndex === null || endIndex === null) return 0;
  return clampZero(endIndex - startIndex);
}

function calculateFederalLtcgTax(gain, otherIncome, status) {
  const brackets = FEDERAL_LTCG_2026[status] || FEDERAL_LTCG_2026.married;
  let remaining = clampZero(gain);
  let tax = 0;

  const zeroCapacity = clampZero(brackets.zero - otherIncome);
  const zeroPortion = Math.min(remaining, zeroCapacity);
  remaining -= zeroPortion;

  const fifteenCapacity = clampZero(brackets.fifteen - Math.max(otherIncome, brackets.zero));
  const fifteenPortion = Math.min(remaining, fifteenCapacity);
  tax += fifteenPortion * 0.15;
  remaining -= fifteenPortion;

  tax += remaining * 0.2;
  return tax;
}

function caBaseTax(income, status) {
  const brackets = CA_2025_BRACKETS[status] || CA_2025_BRACKETS.married;
  const taxable = clampZero(income);
  let bracket = brackets[0];

  for (const candidate of brackets) {
    if (taxable >= candidate.over) bracket = candidate;
  }

  const regularTax = bracket.base + (taxable - bracket.over) * bracket.rate;
  const behavioralHealthTax = clampZero(taxable - 1000000) * 0.01;
  return regularTax + behavioralHealthTax;
}

function calculate() {
  const sellingPrice = toNumber(state.sellingPrice);
  const purchasePrice = toNumber(state.purchasePrice);
  const downPayment = toNumber(state.downPayment);
  const sellerRealtorPct = toNumber(state.sellerRealtorPct);
  const buyerRealtorPct = toNumber(state.buyerRealtorPct);
  const mortgagePayoff = toNumber(state.mortgagePayoff);
  const closingCosts = toNumber(state.closingCosts);
  const otherIncome = toNumber(state.otherIncome);
  const holdingMonths = monthsBetween(state.purchaseMonth, state.saleMonth);
  const holdingYears = holdingMonths / 12;
  const monthlyHousingPayment = toNumber(state.monthlyHousingPayment);
  const annualPropertyTax = toNumber(state.annualPropertyTax);
  const annualInsurance = toNumber(state.annualInsurance);
  const filingStatus = state.filingStatus;

  const sellerRealtorFee = sellingPrice * (sellerRealtorPct / 100);
  const buyerRealtorFee = sellingPrice * (buyerRealtorPct / 100);
  const realtorFees = sellerRealtorFee + buyerRealtorFee;
  const sellingExpenses = realtorFees + closingCosts;
  const rawGain = sellingPrice - purchasePrice;
  const basisCosts = state.costs
    .filter((item) => item.basis)
    .reduce((sum, item) => sum + toNumber(item.cost), 0);
  const allTrackedCosts = state.costs.reduce((sum, item) => sum + toNumber(item.cost), 0);
  const adjustedBasis = purchasePrice + basisCosts;
  const amountRealized = sellingPrice - sellingExpenses;
  const gainBeforeExclusion = clampZero(amountRealized - adjustedBasis);
  const exclusionLimit =
    state.qualifiesForExclusion && filingStatus === "married"
      ? 500000
      : state.qualifiesForExclusion
        ? 250000
        : 0;
  const exclusionApplied = Math.min(gainBeforeExclusion, exclusionLimit);
  const taxableGain = clampZero(gainBeforeExclusion - exclusionApplied);
  const saleRetentionRate = 1 - (sellerRealtorPct + buyerRealtorPct) / 100;
  const exclusionTargetSellingPrice =
    exclusionLimit > 0 && saleRetentionRate > 0
      ? (adjustedBasis + closingCosts + exclusionLimit) / saleRetentionRate
      : null;

  const federalTax = calculateFederalLtcgTax(taxableGain, otherIncome, filingStatus);
  const niitThreshold = NIIT_THRESHOLDS[filingStatus] || NIIT_THRESHOLDS.married;
  const niitTax = Math.min(taxableGain, clampZero(otherIncome + taxableGain - niitThreshold)) * 0.038;
  const californiaTax = state.useCaliforniaTax
    ? caBaseTax(otherIncome + taxableGain, filingStatus) - caBaseTax(otherIncome, filingStatus)
    : 0;
  const totalTax = federalTax + niitTax + californiaTax;
  const totalMonthlyPayments = holdingMonths * monthlyHousingPayment;
  const propertyTaxPaid = holdingYears * annualPropertyTax;
  const insurancePaid = holdingYears * annualInsurance;
  const mortgagePaymentPortion = clampZero(totalMonthlyPayments - propertyTaxPaid - insurancePaid);
  const totalOwnershipCost = totalMonthlyPayments + allTrackedCosts;
  const cashBeforeTax = sellingPrice - sellingExpenses - mortgagePayoff;
  const netCash = cashBeforeTax - totalTax;
  const totalCashInvested = downPayment + totalOwnershipCost;
  const economicProfit = netCash - totalCashInvested;

  return {
    sellingPrice,
    purchasePrice,
    downPayment,
    mortgagePayoff,
    closingCosts,
    sellerRealtorFee,
    buyerRealtorFee,
    realtorFees,
    sellingExpenses,
    rawGain,
    holdingMonths,
    holdingYears,
    totalMonthlyPayments,
    propertyTaxPaid,
    insurancePaid,
    mortgagePaymentPortion,
    ownershipCost: totalOwnershipCost,
    totalOwnershipCost,
    basisCosts,
    allTrackedCosts,
    adjustedBasis,
    amountRealized,
    gainBeforeExclusion,
    exclusionLimit,
    exclusionApplied,
    exclusionTargetSellingPrice,
    taxableGain,
    federalTax,
    niitTax,
    californiaTax,
    totalTax,
    cashBeforeTax,
    netCash,
    totalCashInvested,
    economicProfit,
  };
}

function renderInputs() {
  fields.forEach((field) => {
    syncFieldFromState(field);
  });
}

function syncFieldFromState(field) {
  const key = field.dataset.field;
  if (field.type === "checkbox") {
    field.checked = Boolean(state[key]);
  } else if (field.type === "month") {
    field.value = state[key] || "";
  } else if (field.tagName === "SELECT") {
    field.value = state[key];
  } else {
    field.value = formatInput(toNumber(state[key]));
  }
}

function syncCostControlFromState(control, item, costField) {
  if (!control || !item) return;
  if (costField === "basis") {
    control.checked = Boolean(item.basis);
  } else if (costField === "cost") {
    control.value = formatInput(toNumber(item.cost));
  } else if (costField === "description") {
    control.value = item.description;
  }
}

function renderCosts() {
  costList.innerHTML = "";

  if (!state.costs.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No improvements added yet.";
    costList.append(empty);
    return;
  }

  state.costs.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cost-row";
    row.innerHTML = `
      <label>
        <span>Description</span>
        <input data-cost-id="${item.id}" data-cost-field="description" type="text" value="${escapeHtml(item.description)}" />
      </label>
      <label>
        <span>Improvement cost</span>
        <input data-cost-id="${item.id}" data-cost-field="cost" inputmode="decimal" type="text" value="${formatInput(toNumber(item.cost))}" />
      </label>
      <label class="basis-check" title="Checked costs increase adjusted basis and reduce taxable gain">
        <input
          data-cost-id="${item.id}"
          data-cost-field="basis"
          type="checkbox"
          aria-label="Include in adjusted cost basis"
          ${item.basis ? "checked" : ""}
        />
        <span>Include in adjusted cost basis</span>
      </label>
      <button class="icon-button" data-remove-cost="${item.id}" type="button" title="Remove cost">×</button>
    `;
    costList.append(row);
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBars(result) {
  const barStack = document.querySelector("#barStack");
  const max = Math.max(result.sellingPrice, 1);
  const rows = [
    { id: "mortgagePayoff", label: "Mortgage", value: result.mortgagePayoff, color: "var(--blue)" },
    { id: "sellingExpenses", label: "Selling costs", value: result.sellingExpenses, color: "var(--gold)" },
    { id: "ownershipCost", label: "Ownership", value: result.totalOwnershipCost, color: "var(--teal)" },
    { id: "totalTax", label: "Taxes", value: result.totalTax, color: "var(--rose)" },
    { id: "netCash", label: "Net cash", value: result.netCash, color: "var(--green)" },
  ];

  barStack.innerHTML = rows
    .map((row) => {
      const width = Math.min(100, Math.max(0.5, (Math.abs(row.value) / max) * 100));
      return `
        <div class="bar-row">
          <span>${row.label}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${width}%;background:${row.color}"></div></div>
          <strong class="${valueClass(row.value, row.id)}">${displayValue(row.value, row.id)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderResults() {
  const result = calculate();
  const priceLiftPct = result.purchasePrice
    ? ((result.sellingPrice - result.purchasePrice) / result.purchasePrice) * 100
    : 0;
  const values = {
    heroNet: result.economicProfit,
    heroProfit: `Cash to you after sale: ${money(result.netCash)}`,
    netCash: result.netCash,
    economicProfit: result.economicProfit,
    taxableGain: result.taxableGain,
    totalTax: result.totalTax,
    ownershipCost: result.ownershipCost,
    downPayment: result.downPayment,
    rawGain: result.rawGain,
    holdingPeriod: `${result.holdingMonths} months`,
    totalMonthlyPayments: result.totalMonthlyPayments,
    propertyTaxPaid: result.propertyTaxPaid,
    insurancePaid: result.insurancePaid,
    mortgagePaymentPortion: result.mortgagePaymentPortion,
    allTrackedCosts: result.allTrackedCosts,
    totalOwnershipCost: result.totalOwnershipCost,
    sellerRealtorFee: result.sellerRealtorFee,
    buyerRealtorFee: result.buyerRealtorFee,
    realtorFees: result.realtorFees,
    closingCosts: result.closingCosts,
    sellingExpenses: result.sellingExpenses,
    basisCosts: result.basisCosts,
    adjustedBasis: result.adjustedBasis,
    amountRealized: result.amountRealized,
    adjustedBasisFormula: `${money(result.purchasePrice)} purchase price + ${money(result.basisCosts)} basis improvements`,
    amountRealizedFormula: `${money(result.sellingPrice)} selling price - ${money(result.sellingExpenses)} selling expenses`,
    gainBeforeExclusion: result.gainBeforeExclusion,
    gainBeforeExclusionFormula: `${money(result.amountRealized)} amount realized - ${money(result.adjustedBasis)} adjusted basis`,
    exclusionApplied: result.exclusionApplied,
    taxableGainFormula: `max(${money(result.gainBeforeExclusion)} gain - ${money(result.exclusionApplied)} exclusion, $0)`,
    taxableGainDetail: result.taxableGain,
    federalTax: result.federalTax,
    niitTax: result.niitTax,
    californiaTax: result.californiaTax,
    mortgagePayoff: result.mortgagePayoff,
    cashBeforeTax: result.cashBeforeTax,
    netCashFormula: `${money(result.sellingPrice)} selling price - ${money(result.sellingExpenses)} selling expenses - ${money(result.mortgagePayoff)} mortgage payoff - ${money(result.totalTax)} taxes`,
    netCashDetail: result.netCash,
    totalCashInvested: result.totalCashInvested,
    economicProfitFormula: `${money(result.sellingPrice)} sale - ${money(result.sellingExpenses)} selling expenses - ${money(result.mortgagePayoff)} mortgage payoff - ${money(result.totalTax)} taxes - ${money(result.downPayment)} down payment - ${money(result.totalMonthlyPayments)} monthly payments - ${money(result.allTrackedCosts)} improvements`,
    economicProfitDetail: result.economicProfit,
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.querySelector(`#${id}`);
    if (!element) return;
    element.textContent = displayValue(value, id);
    applyValueClass(element, value, id);
  });

  const heroProfit = document.querySelector("#heroProfit");
  applyValueClass(heroProfit, result.netCash, "netCash");

  const salePriceLift = document.querySelector("#salePriceLift");
  salePriceLift.textContent = `${percent(priceLiftPct)} vs purchase`;
  applyValueClass(salePriceLift, priceLiftPct, "rawGain");

  renderExclusionGauge(result);

  renderBars(result);
}

function renderExclusionGauge(result) {
  const gauge = document.querySelector("#exclusionGauge");
  const target = document.querySelector("#exclusionTargetPrice");
  const track = document.querySelector("#exclusionTrack");
  const fill = document.querySelector("#exclusionFill");
  const hasExclusion = result.exclusionLimit > 0;
  const progress = hasExclusion ? Math.min(1, result.gainBeforeExclusion / result.exclusionLimit) : 0;
  const amountOver = hasExclusion ? clampZero(result.gainBeforeExclusion - result.exclusionLimit) : 0;

  gauge.classList.toggle("is-disabled", !hasExclusion);
  gauge.classList.toggle("is-over", amountOver > 0);
  fill.style.width = `${(progress * 100).toFixed(1)}%`;
  track.setAttribute("aria-valuemax", String(result.exclusionLimit));
  track.setAttribute("aria-valuenow", String(Math.min(result.gainBeforeExclusion, result.exclusionLimit)));

  if (!hasExclusion) {
    target.textContent = "N/A";
    track.setAttribute("aria-valuetext", "Primary-residence exclusion disabled");
    return;
  }

  target.textContent = result.exclusionTargetSellingPrice === null
    ? "N/A"
    : money(result.exclusionTargetSellingPrice);
  track.setAttribute(
    "aria-valuetext",
    amountOver > 0
      ? `Gain exceeds the ${money(result.exclusionLimit)} exclusion by ${money(amountOver)}`
      : `${money(result.gainBeforeExclusion)} of ${money(result.exclusionLimit)} exclusion used; target sale price ${target.textContent}`,
  );
}

function render() {
  renderInputs();
  renderCosts();
  renderResults();
}

fields.forEach((field) => {
  const key = field.dataset.field;
  field.addEventListener("input", () => {
    savedState.textContent = "Editing...";
    if (field.type === "checkbox") {
      state[key] = field.checked;
    } else if (field.type === "month") {
      state[key] = field.value;
    } else if (field.tagName === "SELECT") {
      state[key] = field.value;
    } else {
      state[key] = toNumber(field.value);
    }
    saveState();
    renderResults();
  });

  field.addEventListener("blur", () => syncFieldFromState(field));
});

costList.addEventListener("input", (event) => {
  const target = event.target;
  const id = target.dataset.costId;
  const costField = target.dataset.costField;
  if (!id || !costField) return;

  const item = state.costs.find((cost) => cost.id === id);
  if (!item) return;

  item[costField] =
    costField === "basis" ? target.checked : costField === "cost" ? toNumber(target.value) : target.value;
  saveState();
  renderResults();
});

costList.addEventListener("change", (event) => {
  if (event.target.dataset.costField === "basis") {
    const item = state.costs.find((cost) => cost.id === event.target.dataset.costId);
    if (item) {
      item.basis = event.target.checked;
      saveState();
      const savedItem = state.costs.find((cost) => cost.id === event.target.dataset.costId);
      syncCostControlFromState(event.target, savedItem, "basis");
      renderResults();
    }
  }
});

costList.addEventListener("blur", (event) => {
  if (event.target.dataset.costField !== "cost") return;
  const item = state.costs.find((cost) => cost.id === event.target.dataset.costId);
  syncCostControlFromState(event.target, item, "cost");
}, true);

costList.addEventListener("click", (event) => {
  const id = event.target.dataset.removeCost;
  if (!id) return;
  state.costs = state.costs.filter((item) => item.id !== id);
  saveState();
  render();
});

document.querySelector("#addCostButton").addEventListener("click", () => {
  state.costs.push({
    id: createId(),
    description: "New improvement",
    cost: 0,
    basis: true,
  });
  saveState();
  render();
});

document.querySelector("#resetButton").addEventListener("click", () => {
  state = createDefaultState();
  saveState();
  render();
});

saveState();
render();
