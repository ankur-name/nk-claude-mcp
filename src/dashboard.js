const RECO_HUB_PATH = "/v1/acqu-shortlisted-domains/shortlisted-domains-for-reco-v1";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill it.`);
  }
  return String(value).trim();
}

/** Shared-secret auth for Dashboard Claude / Reco Hub calls (same pattern as GD inventory). */
function dashboardHeaders(extra = {}) {
  const key = requiredEnv("DASHBOARD_INTERNAL_KEY");
  return {
    Accept: "application/json",
    "X-Internal-Service": key,
    ...extra,
  };
}

export async function submitClaudeRecos(recos) {
  const baseUrl = requiredEnv("DASHBOARD_BASE_URL").replace(/\/$/, "");
  const url = `${baseUrl}/v1/acqu-shortlisted-domains/claude-recos`;
  const response = await fetch(url, {
    method: "PUT",
    headers: dashboardHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ recos }),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`claude-recos ${response.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

export async function getApprovalFeedback({ searchDomains, size = 20 } = {}) {
  const baseUrl = requiredEnv("DASHBOARD_BASE_URL").replace(/\/$/, "");
  const params = new URLSearchParams({
    size: String(Math.min(Number(size) || 20, 50)),
  });
  if (Array.isArray(searchDomains) && searchDomains.length > 0) {
    params.set("searchDomains", JSON.stringify(searchDomains));
  }
  const url = `${baseUrl}/v1/acqu-shortlisted-domains/claude-reco-feedback?${params.toString()}`;
  const response = await fetch(url, {
    headers: dashboardHeaders(),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`claude-reco-feedback ${response.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

export async function getOrderResults({ size = 20 } = {}) {
  const baseUrl = requiredEnv("DASHBOARD_BASE_URL").replace(/\/$/, "");
  const params = new URLSearchParams({
    size: String(Math.min(Number(size) || 20, 50)),
  });
  const url = `${baseUrl}/v1/acqu-shortlisted-domains/claude-order-results?${params.toString()}`;
  const response = await fetch(url, {
    headers: dashboardHeaders(),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`claude-order-results ${response.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

export async function getRecoHubDomains({
  sourceType = "ed",
  tab = "ALL",
  page = 0,
  size = 20,
  search,
  searchDomains,
  onlyMine = false,
} = {}) {
  const baseUrl = requiredEnv("DASHBOARD_BASE_URL").replace(/\/$/, "");

  const params = new URLSearchParams({
    sourceType,
    tab,
    page: String(page),
    size: String(Math.min(Number(size) || 20, 50)),
    onlyMine: String(Boolean(onlyMine)),
  });

  if (search && String(search).trim().length >= 3) {
    params.set("search", String(search).trim());
  }

  if (Array.isArray(searchDomains) && searchDomains.length > 0) {
    params.set("searchDomains", JSON.stringify(searchDomains));
  }

  const url = `${baseUrl}${RECO_HUB_PATH}?${params.toString()}`;
  const response = await fetch(url, {
    headers: dashboardHeaders(),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Reco Hub API ${response.status}: ${text.slice(0, 500) || response.statusText}`
    );
  }

  const body = text ? JSON.parse(text) : {};
  const content = Array.isArray(body.content) ? body.content : [];

  return {
    sourceType,
    tab,
    page: body.number ?? page,
    size: body.size ?? size,
    totalElements: body.totalElements ?? content.length,
    totalPages: body.totalPages ?? 0,
    domains: content,
  };
}
