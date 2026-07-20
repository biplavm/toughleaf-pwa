import { describe, it, expect } from 'vitest';
import {
  outreachFunnel,
  participationBreakdown,
  goalVsActual,
  auditReady,
} from './reporting.js';

function makeCompany(id, name, certs = []) {
  return {
    id,
    company_name: name,
    certifications: certs.map((code) => ({ code, label: code.split('-').pop(), agency: 'TPACTY' })),
  };
}

function makeSurvey(companyId, opts = {}) {
  const {
    invitationStatus = 'invited',
    bidPackages = [],
    participant,
  } = opts;
  return {
    id: `survey-${companyId}`,
    project_id: 1,
    company_id: companyId,
    invitation_status: invitationStatus,
    workflow_step_id: opts.workflowStepId ?? null,
    workflow_step: opts.workflowStep,
    participant,
    included_bid_packages: bidPackages,
  };
}

const CERTS = {
  dbe: 'TPACTY-TPACTY-DBE',
  mbe: 'TPACTY-TPACTY-MBE',
  wbe: 'TPACTY-TPACTY-WBE',
};

describe('outreachFunnel', () => {
  it('returns zero counts for empty surveys', () => {
    const r = outreachFunnel([]);
    expect(r.counts).toEqual({ invited: 0, viewed: 0, interested: 0, submitted: 0, awarded: 0 });
    expect(r.total).toBe(0);
    expect(r.rates.viewed).toBe(null);
  });

  it('classifies each survey into a single funnel stage', () => {
    const surveys = [
      makeSurvey(1, { invitationStatus: 'invited' }),
      makeSurvey(2, { invitationStatus: 'viewed' }),
      makeSurvey(3, { invitationStatus: 'accepted', bidPackages: [{ activity_status: 'attached' }] }),
      makeSurvey(4, { invitationStatus: 'accepted', bidPackages: [{ bid_status: 'bid_submitted' }] }),
      makeSurvey(5, { invitationStatus: 'completed', bidPackages: [{ bid_status: 'bid_awarded' }] }),
    ];
    const r = outreachFunnel(surveys);
    expect(r.counts).toEqual({ invited: 1, viewed: 1, interested: 1, submitted: 1, awarded: 1 });
  });

  it('awarded takes priority over submitted', () => {
    const s = makeSurvey(1, {
      invitationStatus: 'completed',
      bidPackages: [{ bid_status: 'bid_awarded' }, { bid_status: 'bid_submitted' }],
    });
    const r = outreachFunnel([s]);
    expect(r.counts.awarded).toBe(1);
    expect(r.counts.submitted).toBe(0);
  });

  it('interested requires both accepted/applied status AND attached bid package', () => {
    const acceptedNoPkg = makeSurvey(1, { invitationStatus: 'accepted', bidPackages: [] });
    const acceptedWithPkg = makeSurvey(2, {
      invitationStatus: 'accepted',
      bidPackages: [{ activity_status: 'attached' }],
    });
    const r = outreachFunnel([acceptedNoPkg, acceptedWithPkg]);
    expect(r.counts.interested).toBe(1);
    expect(r.counts.viewed).toBe(1);
  });

  it('computes conversion rates between stages', () => {
    const surveys = [
      makeSurvey(1, { invitationStatus: 'invited' }),
      makeSurvey(2, { invitationStatus: 'invited' }),
      makeSurvey(3, { invitationStatus: 'viewed' }),
    ];
    const r = outreachFunnel(surveys);
    expect(r.rates.viewed).toBe(50);
  });

  it('handles non-array input gracefully', () => {
    const r = outreachFunnel(null);
    expect(r.total).toBe(0);
  });
});

describe('participationBreakdown', () => {
  it('groups firms by certification type', () => {
    const participants = [
      { company_id: 1, company: makeCompany(1, 'A Co', [CERTS.dbe, CERTS.wbe]) },
      { company_id: 2, company: makeCompany(2, 'B Co', [CERTS.dbe]) },
      { company_id: 3, company: makeCompany(3, 'C Co', [CERTS.mbe]) },
      { company_id: 4, company: makeCompany(4, 'D Co', []) },
    ];
    const r = participationBreakdown(participants, [], { req_certification_types: ['DBE'] });
    const dbe = r.groups.find((g) => g.type === 'DBE');
    expect(dbe.firms.length).toBe(2);
    expect(dbe.required).toBe(true);

    const uncertified = r.groups.find((g) => g.type === 'Uncertified');
    expect(uncertified.firms.length).toBe(1);
  });

  it('identifies certification gaps', () => {
    const participants = [
      { company_id: 1, company: makeCompany(1, 'A Co', [CERTS.dbe]) },
    ];
    const r = participationBreakdown(participants, [], {
      req_certification_types: ['DBE', 'WBE'],
    });
    expect(r.gaps.map((g) => g.type)).toEqual(['WBE']);
  });

  it('counts awarded firms per group', () => {
    const participants = [
      { company_id: 1, company: makeCompany(1, 'A Co', [CERTS.dbe]) },
      { company_id: 2, company: makeCompany(2, 'B Co', [CERTS.wbe]) },
    ];
    const surveys = [
      makeSurvey(1, { invitationStatus: 'completed', bidPackages: [{ bid_status: 'bid_awarded' }] }),
    ];
    const r = participationBreakdown(participants, surveys, {});
    const dbe = r.groups.find((g) => g.type === 'DBE');
    expect(dbe.awarded).toBe(1);
  });

  it('handles empty participants', () => {
    const r = participationBreakdown([], [], { req_certification_types: ['DBE'] });
    expect(r.totalFirms).toBe(0);
    expect(r.gaps.map((g) => g.type)).toEqual(['DBE']);
  });
});

describe('goalVsActual', () => {
  it('parses "18% DBE" goal string', () => {
    const r = goalVsActual({ req_participation: '18% DBE' }, []);
    expect(r.parseable).toBe(true);
    expect(r.goalPercent).toBe(18);
    expect(r.goalType).toBe('DBE');
  });

  it('returns null actual when no awards', () => {
    const r = goalVsActual(
      { req_participation: '18% DBE', bid_packages: [{ approx_value: 1000000 }] },
      [],
    );
    expect(r.actualPercent).toBe(null);
    expect(r.hasAwards).toBe(false);
  });

  it('computes diverse percentage from awarded amounts', () => {
    const diverseCo = makeCompany(10, 'Diverse', [CERTS.dbe]);
    const surveys = [makeSurvey(10, { participant: diverseCo })];
    const project = {
      req_participation: '18% DBE',
      bid_packages: [
        { awarded_to: { company_id: 10, amount: 200000 } },
        { awarded_to: { company_id: 99, amount: 800000 } },
      ],
    };
    const r = goalVsActual(project, surveys);
    expect(r.hasAwards).toBe(true);
    expect(r.totalAwarded).toBe(1000000);
    expect(r.diverseAwarded).toBe(200000);
    expect(r.actualPercent).toBe(20);
  });

  it('handles unparseable goal string (still computes actual)', () => {
    const diverseCo = makeCompany(10, 'Diverse', [CERTS.dbe]);
    const surveys = [makeSurvey(10, { participant: diverseCo })];
    const project = {
      req_participation: 'See project notes for goal',
      bid_packages: [{ awarded_to: { company_id: 10, amount: 500000 } }],
    };
    const r = goalVsActual(project, surveys);
    expect(r.parseable).toBe(false);
    expect(r.goalPercent).toBe(null);
    expect(r.actualPercent).toBe(null);
    expect(r.hasAwards).toBe(true);
  });

  it('handles null req_participation', () => {
    const r = goalVsActual({}, []);
    expect(r.rawGoal).toBe(null);
    expect(r.parseable).toBe(false);
  });

  it('falls back to package approx_value when awarded amount missing', () => {
    const r = goalVsActual(
      { req_participation: '10%', bid_packages: [{ awarded_to: { company_id: 1 }, approx_value: 500000 }] },
      [],
    );
    expect(r.hasAwards).toBe(true);
    expect(r.totalAwarded).toBe(500000);
  });
});

describe('auditReady', () => {
  it('passes for a well-documented project', () => {
    const project = {
      bid_due_date: '2099-01-01',
      req_certification_types: ['DBE'],
      bid_packages: [
        { id: 1, outreach_status: 'in_progress' },
        { id: 2, outreach_status: 'closed', outreach_completion_date: '2025-01-01' },
      ],
    };
    const participants = [
      { company_id: 1, company: makeCompany(1, 'Diverse Co', [CERTS.dbe]) },
    ];
    const surveys = [
      makeSurvey(1, {
        invitationStatus: 'accepted',
        bidPackages: [{ bid_package_id: 1, activity_status: 'attached', invitation_status: 'invited' }],
      }),
    ];
    const r = auditReady(project, participants, surveys);
    expect(r.passed).toBe(true);
    expect(r.criticalMissing).toBe(0);
  });

  it('flags missing diverse firms as critical', () => {
    const project = {
      req_certification_types: ['DBE'],
      bid_packages: [{ id: 1, outreach_status: 'in_progress' }],
    };
    const participants = [
      { company_id: 1, company: makeCompany(1, 'No Certs Co', []) },
    ];
    const surveys = [
      makeSurvey(1, { bidPackages: [{ bid_package_id: 1, activity_status: 'attached' }] }),
    ];
    const r = auditReady(project, participants, surveys);
    expect(r.passed).toBe(false);
    expect(r.criticalMissing).toBeGreaterThan(0);
    const diverseCheck = r.checklist.find((c) => c.id === 'has_diverse');
    expect(diverseCheck.passed).toBe(false);
    expect(diverseCheck.critical).toBe(true);
  });

  it('cert gaps are non-critical', () => {
    const project = {
      req_certification_types: ['DBE', 'WBE'],
      bid_packages: [{ id: 1, outreach_status: 'in_progress' }],
    };
    const participants = [
      { company_id: 1, company: makeCompany(1, 'DBE Co', [CERTS.dbe]) },
    ];
    const surveys = [
      makeSurvey(1, { bidPackages: [{ bid_package_id: 1, activity_status: 'attached' }] }),
    ];
    const r = auditReady(project, participants, surveys);
    const gapCheck = r.checklist.find((c) => c.id === 'no_cert_gaps');
    expect(gapCheck.passed).toBe(false);
    expect(gapCheck.critical).toBe(false);
  });

  it('flags outreach not started as critical', () => {
    const project = {
      bid_packages: [{ id: 1, outreach_status: 'not_started' }],
    };
    const r = auditReady(project, [{ company_id: 1, company: makeCompany(1, 'Co', []) }], []);
    const startedCheck = r.checklist.find((c) => c.id === 'outreach_started');
    expect(startedCheck.passed).toBe(false);
    expect(r.passed).toBe(false);
  });

  it('handles empty project gracefully', () => {
    const r = auditReady({}, [], []);
    expect(r.checklist.length).toBeGreaterThan(0);
  });
});
