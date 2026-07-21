const NON_DIFFERENTIATING_WORDS = new Set([
  'services',
  'service',
  'enterprise',
  'enterprises',
  'naics',
  'llc',
  'inc',
  'corp',
  'corporation',
  'company',
  'co',
  'the',
  'and',
  'of',
  'for',
  'a',
  'an',
  'contracting',
  'contractors',
  'contractor',
  'construction',
  'general',
  'all',
  'other',
  'misc',
  'miscellaneous',
  'specialty',
  'trades',
  'trade',
  'work',
  'works',
  'solutions',
  'solution',
  'systems',
  'system',
  'group',
  'industries',
  'industry',
  'partners',
  'partner',
  'associates',
  'associate',
]);

export function capabilitiesToKeywords(capabilities) {
  if (!Array.isArray(capabilities)) return [];
  const keywords = [];
  for (const cap of capabilities) {
    const name = typeof cap === 'string' ? cap : cap?.name ?? cap?.label ?? '';
    if (!name) continue;
    const words = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !NON_DIFFERENTIATING_WORDS.has(w));
    if (words.length > 0) {
      keywords.push(words.join(' '));
    }
  }
  return keywords;
}

export function isSourcingProject(project) {
  if (!project) return false;
  const published = project.published === true;
  const status = project.status;
  const bidPackages = Array.isArray(project.bid_packages) ? project.bid_packages : [];
  const hasSourcingPackage = bidPackages.some(
    (bp) => bp?.outreach_status === 'not_started' || bp?.outreach_status === 'filling_package',
  );
  return published && status === 'self_service' && hasSourcingPackage;
}

export function hasRequiredCapabilities(bidPackage) {
  if (!bidPackage) return false;
  const caps = bidPackage.req_capabilities ?? bidPackage.required_capabilities;
  return Array.isArray(caps) && caps.length > 0;
}

export function suggestedFirmsSearchFilter(project, bidPackage) {
  const keywords = capabilitiesToKeywords(
    bidPackage?.req_capabilities ?? bidPackage?.required_capabilities ?? [],
  );
  const filter = {};

  if (keywords.length > 0) {
    filter.keyword = keywords.join(' ');
  }

  if (project?.zip) {
    filter.zip = [project.zip];
    filter.radius = 200;
  }

  if (bidPackage?.req_certification_types) {
    filter.certification_types = bidPackage.req_certification_types;
  }

  return filter;
}

export function isFirmInPackage(companyId, participants, bidPackageId) {
  if (!Array.isArray(participants)) return false;
  return participants.some((p) => {
    if (p?.company_id !== companyId && p?.company?.id !== companyId) return false;
    const pkgs = p?.bid_packages ?? p?.included_bid_packages;
    if (!Array.isArray(pkgs)) return false;
    return pkgs.some(
      (bp) => bp?.bid_package_id === bidPackageId || bp?.id === bidPackageId,
    );
  });
}

export function firmOtherPackages(companyId, participants, bidPackageId) {
  if (!Array.isArray(participants)) return [];
  const otherPackages = [];
  for (const p of participants) {
    if (p?.company_id !== companyId && p?.company?.id !== companyId) continue;
    const pkgs = p?.bid_packages ?? p?.included_bid_packages;
    if (!Array.isArray(pkgs)) continue;
    for (const bp of pkgs) {
      const pkgId = bp?.bid_package_id ?? bp?.id;
      if (pkgId && pkgId !== bidPackageId) {
        otherPackages.push(pkgId);
      }
    }
  }
  return [...new Set(otherPackages)];
}
