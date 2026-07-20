// Reporting computations — pure functions, data-in/metrics-out.
// No SDK calls here; pass real ProjectData / ProjectSurveyData / ProjectParticipant[] in.

const VIEWED_STATUSES = new Set(['viewed', 'accepted', 'declined', 'applied', 'completed']);
const INTERESTED_STATUSES = new Set(['accepted', 'applied']);

function certTypeCode(code) {
  if (!code || typeof code !== 'string') return null;
  const parts = code.split('-');
  return parts[parts.length - 1] ?? null;
}

function firmCertTypes(company) {
  const certs = company?.certifications;
  if (!Array.isArray(certs)) return [];
  return certs.map((c) => certTypeCode(c?.code ?? c?.type)).filter(Boolean);
}

function surveyBidStatuses(survey) {
  const pkgs = survey?.included_bid_packages;
  if (!Array.isArray(pkgs)) return [];
  return pkgs.map((p) => p?.bid_status).filter(Boolean);
}

function surveyAttached(survey) {
  const pkgs = survey?.included_bid_packages;
  if (!Array.isArray(pkgs)) return false;
  return pkgs.some((p) => p?.activity_status === 'attached');
}

function parseGoalPercent(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const match = raw.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : null;
}

function parseGoalType(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const match = raw.match(/(\d+(?:\.\d+)?)\s*%?\s*([A-Za-z]+)/);
  if (!match) return null;
  const word = match[2].toUpperCase();
  if (word === 'OF' || word === 'GOAL' || word === 'TARGET' || word === 'PARTICIPATION') return null;
  return word;
}

function awardedDollars(bidPackage) {
  const awarded = bidPackage?.awarded_to;
  if (!awarded || typeof awarded !== 'object') return null;
  const amount = awarded.amount;
  if (amount == null || isNaN(Number(amount))) return null;
  return Number(amount);
}

function packageValue(bidPackage) {
  const v = bidPackage?.approx_value;
  if (v == null || isNaN(Number(v))) return null;
  return Number(v);
}

function isDiverseFirm(company, goalType) {
  if (!goalType) return false;
  const types = firmCertTypes(company);
  return types.some((t) => t.toUpperCase() === goalType.toUpperCase());
}

const FUNNEL_STAGES = ['invited', 'viewed', 'interested', 'submitted', 'awarded'];

function funnelStage(survey) {
  const status = survey?.invitation_status;
  const bidStatuses = surveyBidStatuses(survey);

  if (bidStatuses.includes('bid_awarded')) return 'awarded';
  if (bidStatuses.includes('bid_submitted')) return 'submitted';
  if (INTERESTED_STATUSES.has(status) && surveyAttached(survey)) return 'interested';
  if (VIEWED_STATUSES.has(status)) return 'viewed';
  if (status === 'invited') return 'invited';
  return null;
}

export function outreachFunnel(surveys) {
  if (!Array.isArray(surveys)) surveys = [];
  const counts = { invited: 0, viewed: 0, interested: 0, submitted: 0, awarded: 0 };
  const byStage = { invited: [], viewed: [], interested: [], submitted: [], awarded: [] };

  for (const s of surveys) {
    const stage = funnelStage(s);
    if (!stage) continue;
    counts[stage]++;
    byStage[stage].push(s);
  }

  const rates = {};
  for (let i = 1; i < FUNNEL_STAGES.length; i++) {
    const prev = counts[FUNNEL_STAGES[i - 1]];
    const curr = counts[FUNNEL_STAGES[i]];
    rates[FUNNEL_STAGES[i]] = prev > 0 ? Math.round((curr / prev) * 100) : null;
  }

  return { counts, byStage, rates, total: surveys.length };
}

export function participationBreakdown(participants, surveys, project) {
  if (!Array.isArray(participants)) participants = [];
  if (!Array.isArray(surveys)) surveys = [];

  const reqTypes = Array.isArray(project?.req_certification_types)
    ? project.req_certification_types
    : [];
  const reqSet = new Set(reqTypes.map((t) => String(t).toUpperCase()));

  const groups = new Map();

  function ensureGroup(type) {
    const key = type.toUpperCase();
    if (!groups.has(key)) {
      groups.set(key, { type, firms: [], awarded: 0, required: reqSet.has(key) });
    }
    return groups.get(key);
  }

  for (const t of reqTypes) ensureGroup(String(t));

  const surveyByCompany = new Map();
  for (const s of surveys) {
    if (s?.company_id != null) surveyByCompany.set(s.company_id, s);
  }

  for (const p of participants) {
    const company = p?.company ?? p;
    const types = firmCertTypes(company);
    const uniqueTypes = [...new Set(types)];
    if (uniqueTypes.length === 0) {
      const g = ensureGroup('Uncertified');
      g.firms.push(p);
      const s = surveyByCompany.get(p?.company_id ?? company?.id);
      if (s && surveyBidStatuses(s).includes('bid_awarded')) g.awarded++;
    } else {
      for (const t of uniqueTypes) {
        const g = ensureGroup(t);
        g.firms.push(p);
        const s = surveyByCompany.get(p?.company_id ?? company?.id);
        if (s && surveyBidStatuses(s).includes('bid_awarded')) g.awarded++;
      }
    }
  }

  const groupsArr = [...groups.values()].sort((a, b) => {
    if (a.required !== b.required) return b.required - a.required;
    return b.firms.length - a.firms.length;
  });

  const gaps = groupsArr.filter((g) => g.required && g.firms.length === 0);

  return { groups: groupsArr, gaps, totalFirms: participants.length };
}

export function goalVsActual(project, surveys) {
  const rawGoal = project?.req_participation ?? null;
  const goalPercent = parseGoalPercent(rawGoal);
  const goalType = parseGoalType(rawGoal);

  const bidPackages = Array.isArray(project?.bid_packages) ? project.bid_packages : [];
  let totalAwarded = 0;
  let diverseAwarded = 0;
  let hasAwards = false;

  const surveyByCompany = new Map();
  if (Array.isArray(surveys)) {
    for (const s of surveys) {
      if (s?.company_id != null) surveyByCompany.set(s.company_id, s);
    }
  }

  for (const pkg of bidPackages) {
    const awarded = pkg?.awarded_to;
    if (!awarded || typeof awarded !== 'object') continue;
    const amount = awardedDollars(pkg) ?? packageValue(pkg);
    if (amount == null) continue;
    hasAwards = true;
    totalAwarded += amount;

    if (goalType) {
      const companyId = awarded.company_id;
      const survey = companyId != null ? surveyByCompany.get(companyId) : null;
      const company = survey?.participant ?? awarded;
      if (isDiverseFirm(company, goalType)) diverseAwarded += amount;
    }
  }

  const actualPercent = hasAwards && totalAwarded > 0 && goalType
    ? Math.round((diverseAwarded / totalAwarded) * 1000) / 10
    : null;

  return {
    rawGoal,
    goalPercent,
    goalType,
    actualPercent,
    totalAwarded,
    diverseAwarded,
    hasAwards,
    parseable: goalPercent != null,
  };
}

export function auditReady(project, participants, surveys) {
  if (!Array.isArray(participants)) participants = [];
  if (!Array.isArray(surveys)) surveys = [];
  const bidPackages = Array.isArray(project?.bid_packages) ? project.bid_packages : [];
  const reqTypes = Array.isArray(project?.req_certification_types)
    ? project.req_certification_types
    : [];
  const reqSet = new Set(reqTypes.map((t) => String(t).toUpperCase()));

  const checklist = [];
  let criticalMissing = 0;

  function check(id, label, passed, critical) {
    checklist.push({ id, label, passed, critical: critical !== false });
    if (!passed && critical !== false) criticalMissing++;
  }

  const packagesWithParticipants = new Set();
  for (const s of surveys) {
    const pkgs = Array.isArray(s?.included_bid_packages) ? s.included_bid_packages : [];
    for (const p of pkgs) {
      if (p?.activity_status === 'attached' || p?.invitation_status === 'invited') {
        if (p?.bid_package_id != null) packagesWithParticipants.add(p.bid_package_id);
      }
    }
  }

  check(
    'has_participants',
    'At least one firm invited per bid package',
    participants.length > 0 && (bidPackages.length === 0 || packagesWithParticipants.size > 0),
  );

  const participantCertTypes = new Set();
  for (const p of participants) {
    for (const t of firmCertTypes(p?.company ?? p)) participantCertTypes.add(t.toUpperCase());
  }
  const hasDiverse = reqTypes.length === 0 ||
    reqTypes.some((t) => participantCertTypes.has(String(t).toUpperCase()));
  check('has_diverse', 'Diverse firms matching certification requirements', hasDiverse);

  const allOutreachStarted = bidPackages.length === 0 ||
    bidPackages.every((p) => p?.outreach_status && p.outreach_status !== 'not_started');
  check('outreach_started', 'Outreach started on all bid packages', allOutreachStarted);

  const closedPackages = bidPackages.filter((p) => p?.outreach_status === 'closed');
  const outreachDocumented = closedPackages.length === 0 ||
    closedPackages.every((p) => p?.outreach_completion_date);
  check('outreach_documented', 'Outreach completion documented for closed packages', outreachDocumented, false);

  const pastDue = project?.bid_due_date && new Date(project.bid_due_date) < new Date();
  const awardsDocumented = !pastDue ||
    bidPackages.length === 0 ||
    bidPackages.every((p) => p?.awarded_to || !p?.bid_due_date || new Date(p.bid_due_date) >= new Date());
  check('awards_documented', 'Awards documented for packages past due date', awardsDocumented);

  const certGaps = reqTypes.filter((t) => !participantCertTypes.has(String(t).toUpperCase()));
  check('no_cert_gaps', `No certification gaps${certGaps.length ? ' (missing: ' + certGaps.join(', ') + ')' : ''}`, certGaps.length === 0, false);

  return {
    checklist,
    criticalMissing,
    passed: criticalMissing === 0,
    complete: checklist.every((c) => c.passed),
  };
}

export function crossProjectMetrics(projectResults) {
  if (!Array.isArray(projectResults)) projectResults = [];

  const firmIds = new Set();
  let totalAwarded = 0;
  let diverseAwarded = 0;
  let hasAwardData = false;
  const outreachStatusCounts = {};
  const goalsAtRisk = [];
  const deadlineBuckets = { days7: [], days14: [], days30: [] };
  let activeProjects = 0;

  const now = new Date();
  const dayMs = 1000 * 60 * 60 * 24;

  for (const result of projectResults) {
    if (!result) continue;
    const { project, participants, surveys } = result;
    if (!project) continue;

    const status = project.status;
    if (status && status !== 'not_started' && status !== 'closed_won' && status !== 'closed_lost') {
      activeProjects++;
    }

    if (Array.isArray(participants)) {
      for (const p of participants) {
        const id = p?.company_id ?? p?.company?.id ?? p?.id;
        if (id != null) firmIds.add(id);
      }
    }

    const bidPackages = Array.isArray(project.bid_packages) ? project.bid_packages : [];
    for (const pkg of bidPackages) {
      const os = pkg?.outreach_status;
      if (os) outreachStatusCounts[os] = (outreachStatusCounts[os] ?? 0) + 1;

      const awarded = pkg?.awarded_to;
      if (awarded && typeof awarded === 'object') {
        const amount = awardedDollars(pkg) ?? packageValue(pkg);
        if (amount != null) {
          hasAwardData = true;
          totalAwarded += amount;

          if (Array.isArray(surveys)) {
            const survey = surveys.find((s) => s?.company_id === awarded.company_id);
            const company = survey?.participant ?? awarded;
            const goal = goalVsActual(project, surveys);
            if (goal.goalType && isDiverseFirm(company, goal.goalType)) {
              diverseAwarded += amount;
            }
          }
        }
      }
    }

    if (project.bid_due_date) {
      const due = new Date(project.bid_due_date);
      const diff = (due - now) / dayMs;
      if (diff >= 0 && diff <= 7) deadlineBuckets.days7.push(project);
      if (diff >= 0 && diff <= 14) deadlineBuckets.days14.push(project);
      if (diff >= 0 && diff <= 30) deadlineBuckets.days30.push(project);
    }

    if (Array.isArray(surveys) && project.req_participation) {
      const goal = goalVsActual(project, surveys);
      if (goal.parseable && goal.actualPercent != null && goal.goalPercent != null) {
        if (goal.actualPercent < goal.goalPercent) {
          goalsAtRisk.push({
            project,
            goalPercent: goal.goalPercent,
            actualPercent: goal.actualPercent,
            goalType: goal.goalType,
          });
        }
      }
    }
  }

  const diversePercent = hasAwardData && totalAwarded > 0
    ? Math.round((diverseAwarded / totalAwarded) * 1000) / 10
    : null;

  return {
    activeProjects,
    totalFirms: firmIds.size,
    totalAwarded,
    diverseAwarded,
    diversePercent,
    hasAwardData,
    outreachStatusCounts,
    goalsAtRisk,
    deadlineBuckets,
    projectsLoaded: projectResults.filter((r) => r?.project).length,
  };
}

const PROJECT_STATUS_ORDER = [
  'not_started',
  'discovery',
  'filling_package',
  'awaiting_documents',
  'outreach_in_progress',
  'outreach_completed',
  'closed_won',
  'closed_lost',
];

export function projectTimeline(project) {
  if (!project) return null;

  const status = project.status ?? 'not_started';
  const currentIdx = PROJECT_STATUS_ORDER.indexOf(status);
  const effectiveIdx = currentIdx === -1 ? 0 : currentIdx;

  const milestones = [];

  const dateFields = [
    { key: 'meeting_date', label: 'Pre-bid Meeting' },
    { key: 'send_documents_on_date', label: 'Send Documents' },
    { key: 'bid_due_date', label: 'Bid Due' },
    { key: 'approx_start_date', label: 'Approx Start' },
    { key: 'approx_finish_date', label: 'Approx Finish' },
  ];

  for (const { key, label } of dateFields) {
    const date = project[key];
    if (date) {
      milestones.push({ key, label, date, overdue: new Date(date) < new Date() });
    }
  }

  const bidPackages = Array.isArray(project.bid_packages) ? project.bid_packages : [];
  for (const pkg of bidPackages) {
    if (pkg?.outreach_completion_date) {
      milestones.push({
        key: `pkg_outreach_${pkg.id}`,
        label: `Outreach Complete: ${pkg.name ?? 'Package'}`,
        date: pkg.outreach_completion_date,
        overdue: false,
      });
    }
    if (pkg?.response_deadline_date) {
      milestones.push({
        key: `pkg_response_${pkg.id}`,
        label: `Response Due: ${pkg.name ?? 'Package'}`,
        date: pkg.response_deadline_date,
        overdue: new Date(pkg.response_deadline_date) < new Date(),
      });
    }
  }

  milestones.sort((a, b) => new Date(a.date) - new Date(b.date));

  const stages = PROJECT_STATUS_ORDER.map((s, i) => ({
    id: s,
    label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    reached: i <= effectiveIdx,
    current: i === effectiveIdx,
  }));

  return {
    stages,
    milestones,
    currentStage: PROJECT_STATUS_ORDER[effectiveIdx],
    hasMilestones: milestones.length > 0,
  };
}

export function buildOutreachContext(allSurveys) {
  if (!Array.isArray(allSurveys)) allSurveys = [];
  const context = new Map();

  function ensure(companyId) {
    if (!context.has(companyId)) {
      context.set(companyId, {
        companyId,
        invitedCount: 0,
        awardedCount: 0,
        contacted: false,
        projectIds: new Set(),
      });
    }
    return context.get(companyId);
  }

  for (const s of allSurveys) {
    if (!s || s.company_id == null) continue;
    const entry = ensure(s.company_id);
    const status = s.invitation_status;
    if (status && status !== 'none') {
      entry.contacted = true;
      entry.invitedCount++;
      if (s.project_id != null) entry.projectIds.add(s.project_id);
    }
    const pkgs = Array.isArray(s.included_bid_packages) ? s.included_bid_packages : [];
    if (pkgs.some((p) => p?.bid_status === 'bid_awarded')) {
      entry.awardedCount++;
    }
  }

  return context;
}

export function outreachBadge(context, companyId) {
  if (!context || companyId == null) return null;
  const entry = context.get(companyId);
  if (!entry) return { label: 'Never contacted', tone: 'muted' };
  if (entry.awardedCount > 0) {
    return {
      label: `Awarded on ${entry.awardedCount} project${entry.awardedCount > 1 ? 's' : ''}`,
      tone: 'success',
    };
  }
  if (entry.invitedCount > 0) {
    return {
      label: `Invited to ${entry.invitedCount} project${entry.invitedCount > 1 ? 's' : ''}`,
      tone: 'accent',
    };
  }
  return { label: 'Never contacted', tone: 'muted' };
}
