import { describe, it, expect } from 'vitest';
import {
  capabilitiesToKeywords,
  isSourcingProject,
  hasRequiredCapabilities,
  suggestedFirmsSearchFilter,
  isFirmInPackage,
  firmOtherPackages,
} from './sourcing.js';

describe('capabilitiesToKeywords', () => {
  it('extracts meaningful words from capability names', () => {
    const result = capabilitiesToKeywords(['Electrical Services', 'HVAC Installation']);
    expect(result).toEqual(['electrical', 'hvac installation']);
  });

  it('filters non-differentiating words', () => {
    const result = capabilitiesToKeywords([
      'General Construction Services',
      'Specialty Trade Contractors',
    ]);
    expect(result).toEqual([]);
  });

  it('handles single-word capabilities', () => {
    const result = capabilitiesToKeywords(['Plumbing', 'Roofing', 'Concrete']);
    expect(result).toEqual(['plumbing', 'roofing', 'concrete']);
  });

  it('preserves multi-word phrases after filtering', () => {
    const result = capabilitiesToKeywords(['Concrete Pouring', 'Steel Erection']);
    expect(result).toEqual(['concrete pouring', 'steel erection']);
  });

  it('handles objects with name property', () => {
    const result = capabilitiesToKeywords([{ name: 'Electrical Services' }, { name: 'Plumbing' }]);
    expect(result).toEqual(['electrical', 'plumbing']);
  });

  it('handles objects with label property', () => {
    const result = capabilitiesToKeywords([{ label: 'HVAC' }]);
    expect(result).toEqual(['hvac']);
  });

  it('strips punctuation', () => {
    const result = capabilitiesToKeywords(['Earth-moving & Excavation']);
    expect(result).toEqual(['earth moving excavation']);
  });

  it('filters short words (1 char)', () => {
    const result = capabilitiesToKeywords(['A Construction']);
    expect(result).toEqual([]); // "a" filtered, "construction" filtered
  });

  it('handles empty input', () => {
    expect(capabilitiesToKeywords([])).toEqual([]);
    expect(capabilitiesToKeywords(null)).toEqual([]);
    expect(capabilitiesToKeywords(undefined)).toEqual([]);
  });
});

describe('isSourcingProject', () => {
  it('returns true for published self_service project with sourcing packages', () => {
    const project = {
      published: true,
      status: 'self_service',
      bid_packages: [{ outreach_status: 'not_started' }, { outreach_status: 'filling_package' }],
    };
    expect(isSourcingProject(project)).toBe(true);
  });

  it('returns false for unpublished project', () => {
    const project = {
      published: false,
      status: 'self_service',
      bid_packages: [{ outreach_status: 'not_started' }],
    };
    expect(isSourcingProject(project)).toBe(false);
  });

  it('returns false for non-self_service status', () => {
    const project = {
      published: true,
      status: 'outreach_in_progress',
      bid_packages: [{ outreach_status: 'not_started' }],
    };
    expect(isSourcingProject(project)).toBe(false);
  });

  it('returns false when all packages are past sourcing', () => {
    const project = {
      published: true,
      status: 'self_service',
      bid_packages: [{ outreach_status: 'in_progress' }, { outreach_status: 'closed' }],
    };
    expect(isSourcingProject(project)).toBe(false);
  });

  it('returns false for null project', () => {
    expect(isSourcingProject(null)).toBe(false);
  });

  it('returns false for project with no bid_packages', () => {
    expect(isSourcingProject({ published: true, status: 'self_service' })).toBe(false);
  });
});

describe('hasRequiredCapabilities', () => {
  it('returns true when req_capabilities is non-empty', () => {
    expect(hasRequiredCapabilities({ req_capabilities: ['Electrical'] })).toBe(true);
  });

  it('returns true when required_capabilities is non-empty', () => {
    expect(hasRequiredCapabilities({ required_capabilities: ['Plumbing'] })).toBe(true);
  });

  it('returns false when req_capabilities is empty', () => {
    expect(hasRequiredCapabilities({ req_capabilities: [] })).toBe(false);
  });

  it('returns false when no capabilities field', () => {
    expect(hasRequiredCapabilities({})).toBe(false);
  });

  it('returns false for null', () => {
    expect(hasRequiredCapabilities(null)).toBe(false);
  });
});

describe('suggestedFirmsSearchFilter', () => {
  it('builds filter from capabilities and project zip', () => {
    const project = { zip: '10001' };
    const bidPackage = { req_capabilities: ['Electrical Services', 'Plumbing'] };
    const filter = suggestedFirmsSearchFilter(project, bidPackage);
    expect(filter.keyword).toBe('electrical plumbing');
    expect(filter.zip).toEqual(['10001']);
    expect(filter.radius).toBe(200);
  });

  it('omits zip when project has no zip', () => {
    const project = {};
    const bidPackage = { req_capabilities: ['HVAC'] };
    const filter = suggestedFirmsSearchFilter(project, bidPackage);
    expect(filter.keyword).toBe('hvac');
    expect(filter.zip).toBeUndefined();
  });

  it('includes certification types when present', () => {
    const filter = suggestedFirmsSearchFilter({}, {
      req_capabilities: ['Electrical'],
      req_certification_types: ['DBE'],
    });
    expect(filter.certification_types).toEqual(['DBE']);
  });

  it('returns empty filter when no capabilities', () => {
    const filter = suggestedFirmsSearchFilter({}, {});
    expect(filter.keyword).toBeUndefined();
  });
});

describe('isFirmInPackage', () => {
  const participants = [
    { company_id: 10, bid_packages: [{ bid_package_id: 1 }, { bid_package_id: 2 }] },
    { company_id: 20, bid_packages: [{ bid_package_id: 1 }] },
  ];

  it('returns true when firm is in the specified package', () => {
    expect(isFirmInPackage(10, participants, 1)).toBe(true);
    expect(isFirmInPackage(20, participants, 1)).toBe(true);
  });

  it('returns false when firm is not in the specified package', () => {
    expect(isFirmInPackage(10, participants, 3)).toBe(false);
    expect(isFirmInPackage(30, participants, 1)).toBe(false);
  });

  it('handles company.id instead of company_id', () => {
    const parts = [{ company: { id: 50 }, bid_packages: [{ bid_package_id: 1 }] }];
    expect(isFirmInPackage(50, parts, 1)).toBe(true);
  });

  it('handles empty participants', () => {
    expect(isFirmInPackage(10, [], 1)).toBe(false);
    expect(isFirmInPackage(10, null, 1)).toBe(false);
  });
});

describe('firmOtherPackages', () => {
  it('returns other package IDs the firm is in', () => {
    const participants = [
      { company_id: 10, bid_packages: [{ bid_package_id: 1 }, { bid_package_id: 2 }, { bid_package_id: 3 }] },
    ];
    expect(firmOtherPackages(10, participants, 1)).toEqual([2, 3]);
  });

  it('returns empty array when firm is only in the specified package', () => {
    const participants = [
      { company_id: 10, bid_packages: [{ bid_package_id: 1 }] },
    ];
    expect(firmOtherPackages(10, participants, 1)).toEqual([]);
  });

  it('deduplicates package IDs', () => {
    const participants = [
      { company_id: 10, bid_packages: [{ bid_package_id: 2, id: 2 }, { id: 2 }] },
    ];
    expect(firmOtherPackages(10, participants, 1)).toEqual([2]);
  });

  it('handles empty participants', () => {
    expect(firmOtherPackages(10, [], 1)).toEqual([]);
    expect(firmOtherPackages(10, null, 1)).toEqual([]);
  });
});
