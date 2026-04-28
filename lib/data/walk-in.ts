import type {
  Account,
  AccountPageData,
  ActivityRecord,
  Contact,
  GeneratedOutput,
  Note,
  Profile,
  RecalledMemory,
  TimelineItem,
  Workspace,
  WorkspaceOverviewData,
} from "@/types";

const NOW = new Date("2026-04-26T09:00:00.000Z");

function hoursAgo(hours: number) {
  return new Date(NOW.getTime() - hours * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number) {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const walkInWorkspace: Workspace = {
  id: "walk-in-workspace",
  owner_id: "walk-in-user",
  name: "Walk-In Experience",
  slug: "walk-in-experience",
  description: "Seeded public walk-in workspace",
  hydradb_tenant_id: "walk-in-experience",
};

export const walkInProfile: Profile = {
  id: "walk-in-user",
  full_name: "Walk-In Experience",
  email: null,
  avatar_url: null,
};

export const walkInAccounts: Account[] = [
  {
    id: "acme",
    workspace_id: walkInWorkspace.id,
    name: "Acme Corp",
    domain: "acme.co",
    industry: "Developer Infrastructure",
    stage: "negotiation",
    priority: "high",
    arr_estimate: 120000,
    owner_name: "Alex Chen",
    notes_summary: "Blocked on compliance and procurement alignment.",
    last_contacted_at: hoursAgo(2),
    created_at: daysAgo(30),
    updated_at: hoursAgo(2),
  },
  {
    id: "globex",
    workspace_id: walkInWorkspace.id,
    name: "Globex Inc",
    domain: "globex.io",
    industry: "Industrial Automation",
    stage: "discovery",
    priority: "medium",
    arr_estimate: 45000,
    owner_name: "Sarah Lee",
    notes_summary: "Competitive cycle with three active vendors.",
    last_contacted_at: hoursAgo(24),
    created_at: daysAgo(26),
    updated_at: hoursAgo(24),
  },
  {
    id: "soylent",
    workspace_id: walkInWorkspace.id,
    name: "Soylent Corp",
    domain: "soylent.co",
    industry: "Manufacturing Ops",
    stage: "at_risk",
    priority: "critical",
    arr_estimate: 250000,
    owner_name: "Alex Chen",
    notes_summary: "Renewal is strained after a Q2 outage.",
    last_contacted_at: daysAgo(5),
    created_at: daysAgo(50),
    updated_at: daysAgo(2),
  },
];

export const walkInContacts: Contact[] = [
  {
    id: "sarah-jenkins",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    name: "Sarah Jenkins",
    email: "sarah@acme.co",
    title: "VP Engineering",
    role_type: "technical_buyer",
    communication_style: "Concise and direct",
    preference_summary: "Prefers bulleted follow-ups with implementation timelines.",
    importance_level: "high",
    linkedin_url: null,
    created_at: daysAgo(28),
    updated_at: hoursAgo(6),
  },
  {
    id: "david-kim",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    name: "David Kim",
    email: "david@acme.co",
    title: "CISO",
    role_type: "technical_buyer",
    communication_style: "Risk-first",
    preference_summary: "Needs explicit compliance proof and timeline commitments.",
    importance_level: "critical",
    linkedin_url: null,
    created_at: daysAgo(28),
    updated_at: hoursAgo(8),
  },
  {
    id: "elena-rostova",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    name: "Elena Rostova",
    email: "elena@acme.co",
    title: "Procurement Lead",
    role_type: "procurement",
    communication_style: "Process-oriented",
    preference_summary: "Wants pricing changes documented with approval dependencies.",
    importance_level: "high",
    linkedin_url: null,
    created_at: daysAgo(28),
    updated_at: hoursAgo(12),
  },
  {
    id: "hank-scorpio",
    workspace_id: walkInWorkspace.id,
    account_id: "globex",
    name: "Hank Scorpio",
    email: "hank@globex.io",
    title: "CEO",
    role_type: "decision_maker",
    communication_style: "Casual and fast",
    preference_summary: "Avoid corporate jargon and anchor on speed to value.",
    importance_level: "high",
    linkedin_url: null,
    created_at: daysAgo(24),
    updated_at: hoursAgo(24),
  },
  {
    id: "priya-nair",
    workspace_id: walkInWorkspace.id,
    account_id: "globex",
    name: "Priya Nair",
    email: "priya@globex.io",
    title: "Automation Director",
    role_type: "champion",
    communication_style: "Detailed",
    preference_summary: "Needs side-by-side comparison against competing tools.",
    importance_level: "medium",
    linkedin_url: null,
    created_at: daysAgo(24),
    updated_at: hoursAgo(20),
  },
  {
    id: "bob-thorn",
    workspace_id: walkInWorkspace.id,
    account_id: "soylent",
    name: "Bob Thorn",
    email: "bob@soylent.co",
    title: "Director of IT",
    role_type: "champion",
    communication_style: "Measured",
    preference_summary: "Needs confidence that SLA remediation is complete.",
    importance_level: "high",
    linkedin_url: null,
    created_at: daysAgo(40),
    updated_at: daysAgo(3),
  },
  {
    id: "alice-glass",
    workspace_id: walkInWorkspace.id,
    account_id: "soylent",
    name: "Alice Glass",
    email: "alice@soylent.co",
    title: "VP Operations",
    role_type: "economic_buyer",
    communication_style: "Executive summary",
    preference_summary: "Requires incident summaries before renewal review.",
    importance_level: "critical",
    linkedin_url: null,
    created_at: daysAgo(40),
    updated_at: daysAgo(2),
  },
];

export const walkInNotes: Note[] = [
  {
    id: "note-acme-sarah",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: "sarah-jenkins",
    author_id: walkInProfile.id,
    title: "Communication preference",
    content:
      "Sarah prefers concise bullet-point emails and wants implementation timelines included in every follow-up.",
    source_type: "meeting_note",
    topic: "communication_preference",
    importance_level: "high",
    hydradb_memory_id: "walkin-note-1",
    created_at: hoursAgo(8),
    updated_at: hoursAgo(8),
  },
  {
    id: "note-acme-david",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: "david-kim",
    author_id: walkInProfile.id,
    title: "Security blocker",
    content:
      "David explicitly stated they cannot proceed without SOC2 Type II compliance verified by Q3.",
    source_type: "call_summary",
    topic: "security_blocker",
    importance_level: "critical",
    hydradb_memory_id: "walkin-note-2",
    created_at: hoursAgo(10),
    updated_at: hoursAgo(10),
  },
  {
    id: "note-acme-elena",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: "elena-rostova",
    author_id: walkInProfile.id,
    title: "Pricing commitment",
    content:
      "Promised to provide a revised tiered pricing model excluding the premium support package.",
    source_type: "manual_note",
    topic: "pricing_commitment",
    importance_level: "high",
    hydradb_memory_id: "walkin-note-3",
    created_at: hoursAgo(12),
    updated_at: hoursAgo(12),
  },
  {
    id: "note-globex-hank",
    workspace_id: walkInWorkspace.id,
    account_id: "globex",
    contact_id: "hank-scorpio",
    author_id: walkInProfile.id,
    title: "Tone preference",
    content: "Hank prefers casual communication. Avoid corporate jargon.",
    source_type: "email_summary",
    topic: "communication_preference",
    importance_level: "medium",
    hydradb_memory_id: "walkin-note-4",
    created_at: hoursAgo(30),
    updated_at: hoursAgo(30),
  },
  {
    id: "note-globex-priya",
    workspace_id: walkInWorkspace.id,
    account_id: "globex",
    contact_id: "priya-nair",
    author_id: walkInProfile.id,
    title: "Competitive pressure",
    content: "Globex is actively evaluating three other vendors for the automation pipeline.",
    source_type: "meeting_note",
    topic: "competitive_risk",
    importance_level: "high",
    hydradb_memory_id: "walkin-note-5",
    created_at: hoursAgo(32),
    updated_at: hoursAgo(32),
  },
  {
    id: "note-soylent-bob",
    workspace_id: walkInWorkspace.id,
    account_id: "soylent",
    contact_id: "bob-thorn",
    author_id: walkInProfile.id,
    title: "Renewal blocker",
    content: "Renewal is blocked pending resolution of the Q2 data outage SLA breach.",
    source_type: "call_summary",
    topic: "renewal_blocker",
    importance_level: "critical",
    hydradb_memory_id: "walkin-note-6",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  {
    id: "note-soylent-alice",
    workspace_id: walkInWorkspace.id,
    account_id: "soylent",
    contact_id: "alice-glass",
    author_id: walkInProfile.id,
    title: "Review requirement",
    content:
      "Alice requires executive summaries for all incident post-mortems before internal review.",
    source_type: "meeting_note",
    topic: "exec_summary_requirement",
    importance_level: "high",
    hydradb_memory_id: "walkin-note-7",
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
];

export const walkInActivities: ActivityRecord[] = [
  {
    id: "activity-acme-email",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: null,
    actor_id: walkInProfile.id,
    activity_type: "email_sent",
    title: "Sent revised technical overview",
    description: "Shared an updated implementation and security overview after the review call.",
    metadata: { topic: "email_sent" },
    occurred_at: hoursAgo(2),
    created_at: hoursAgo(2),
    hydradb_memory_id: null,
  },
  {
    id: "activity-acme-status",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: null,
    actor_id: walkInProfile.id,
    activity_type: "status_changed",
    title: "Added procurement requirements",
    description: "Procurement introduced a legal review requirement before pricing approval.",
    metadata: { topic: "status_changed" },
    occurred_at: hoursAgo(16),
    created_at: hoursAgo(16),
    hydradb_memory_id: null,
  },
  {
    id: "activity-globex-meeting",
    workspace_id: walkInWorkspace.id,
    account_id: "globex",
    contact_id: null,
    actor_id: walkInProfile.id,
    activity_type: "meeting_logged",
    title: "Initial discovery call",
    description: "Discovery surfaced competitive pressure and a need for faster onboarding proof.",
    metadata: { topic: "meeting_logged" },
    occurred_at: hoursAgo(28),
    created_at: hoursAgo(28),
    hydradb_memory_id: null,
  },
  {
    id: "activity-soylent-meeting",
    workspace_id: walkInWorkspace.id,
    account_id: "soylent",
    contact_id: null,
    actor_id: walkInProfile.id,
    activity_type: "meeting_logged",
    title: "Renewal escalation review",
    description: "Customer wants confidence in SLA remediation before renewal approval.",
    metadata: { topic: "meeting_logged" },
    occurred_at: daysAgo(2),
    created_at: daysAgo(2),
    hydradb_memory_id: null,
  },
];

const acmeMemories: RecalledMemory[] = [
  {
    id: "memory-acme-1",
    content:
      "David explicitly stated they cannot proceed without SOC2 Type II compliance verified by Q3.",
    metadata: {
      workspace_id: walkInWorkspace.id,
      account_id: "acme",
      contact_id: "david-kim",
      source_type: "call_summary",
      topic: "security_blocker",
      importance_level: "critical",
      stage: "negotiation",
      created_at: hoursAgo(10),
      entity_type: "note",
      account_name: "Acme Corp",
      contact_name: "David Kim",
      contact_role_type: "technical_buyer",
    },
  },
  {
    id: "memory-acme-2",
    content:
      "Sarah prefers concise bullet-point emails and wants implementation timelines included in every follow-up.",
    metadata: {
      workspace_id: walkInWorkspace.id,
      account_id: "acme",
      contact_id: "sarah-jenkins",
      source_type: "meeting_note",
      topic: "communication_preference",
      importance_level: "high",
      stage: "negotiation",
      created_at: hoursAgo(8),
      entity_type: "note",
      account_name: "Acme Corp",
      contact_name: "Sarah Jenkins",
      contact_role_type: "technical_buyer",
    },
  },
  {
    id: "memory-acme-3",
    content:
      "Promised to provide a revised tiered pricing model excluding the premium support package.",
    metadata: {
      workspace_id: walkInWorkspace.id,
      account_id: "acme",
      contact_id: "elena-rostova",
      source_type: "manual_note",
      topic: "pricing_commitment",
      importance_level: "high",
      stage: "negotiation",
      created_at: hoursAgo(12),
      entity_type: "note",
      account_name: "Acme Corp",
      contact_name: "Elena Rostova",
      contact_role_type: "procurement",
    },
  },
];

const walkInOutputs: GeneratedOutput[] = [
  {
    id: "output-acme-prep",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: "sarah-jenkins",
    action_type: "prepare_meeting",
    prompt: "Focus on blockers and messaging tone.",
    output_text:
      "Objective\nUnblock the Acme deal by aligning on the compliance path, pricing revision, and immediate procurement next steps.\n\nKey talking points\n- Confirm the SOC2 Type II delivery date.\n- Bring the revised pricing model without premium support.\n- Keep the recap concise for Sarah.\n\nRisks / blockers\n- Procurement will not move without compliance proof.\n- Budget timing can slip if the package is not simplified quickly.\n\nRecommended tone\nConcise, direct, and execution-focused.\n\nSuggested next step\nOffer a preliminary attestation letter today while the final report is still in flight.",
    recalled_memories_json: acmeMemories,
    model_name: "walk-in-experience",
    created_by: walkInProfile.id,
    created_at: hoursAgo(1),
  },
  {
    id: "output-acme-followup",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: "sarah-jenkins",
    action_type: "draft_followup",
    prompt: null,
    output_text:
      "Hi Sarah,\n\nThanks again for the review today. Keeping this tight based on your request:\n\n- We are finalizing the SOC2 Type II package and can share a preliminary attestation letter immediately.\n- I am sending the revised tiered pricing model without premium support.\n- I’ll include the implementation timeline in the next update so procurement has a clean package to review.\n\nIf this format works, I’ll keep future follow-ups in the same structure.\n\nBest,\nAlex",
    recalled_memories_json: acmeMemories,
    model_name: "walk-in-experience",
    created_by: walkInProfile.id,
    created_at: hoursAgo(1),
  },
  {
    id: "output-acme-blockers",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: null,
    action_type: "summarize_blockers",
    prompt: null,
    output_text:
      "Current blockers\n- SOC2 Type II proof is a hard blocker for security sign-off.\n- Procurement needs the revised pricing model without premium support.\n\nSeverity\nHigh, because both issues directly gate movement in negotiation.\n\nLikely owner\n- Security blocker: David Kim / internal security review\n- Pricing blocker: Elena Rostova / procurement\n\nSuggested resolution focus\nResolve compliance proof first, then package pricing and timeline in a concise follow-up.",
    recalled_memories_json: acmeMemories,
    model_name: "walk-in-experience",
    created_by: walkInProfile.id,
    created_at: hoursAgo(1),
  },
  {
    id: "output-acme-changes",
    workspace_id: walkInWorkspace.id,
    account_id: "acme",
    contact_id: null,
    action_type: "what_changed_recently",
    prompt: null,
    output_text:
      "New developments\n- Procurement added a legal review dependency before pricing approval.\n- A revised technical overview has already been sent.\n\nNewly introduced risks\n- More process friction on the procurement side.\n\nShifts in stakeholder stance\n- Security remains strict on compliance timing.\n- Procurement is pushing for a cleaner commercial package.\n\nImmediate implications\nThe next update needs compliance proof, revised pricing, and a tight implementation timeline in one packet.",
    recalled_memories_json: acmeMemories,
    model_name: "walk-in-experience",
    created_by: walkInProfile.id,
    created_at: hoursAgo(1),
  },
  {
    id: "output-soylent-blockers",
    workspace_id: walkInWorkspace.id,
    account_id: "soylent",
    contact_id: "alice-glass",
    action_type: "summarize_blockers",
    prompt: null,
    output_text:
      "Current blockers\n- Renewal confidence is low after the Q2 outage.\n- Executive review depends on a clear incident summary.\n\nSeverity\nCritical because the account is already flagged at risk.\n\nSuggested resolution focus\nLead with remediation proof, SLA improvements, and a short executive summary for Alice.",
    recalled_memories_json: [],
    model_name: "walk-in-experience",
    created_by: walkInProfile.id,
    created_at: hoursAgo(6),
  },
];

function timelineForAccount(accountId: string): TimelineItem[] {
  return walkInActivities
    .filter((activity) => activity.account_id === accountId)
    .map((activity): TimelineItem => ({
      id: activity.id,
      type: activity.activity_type.includes("email")
        ? "email"
        : activity.activity_type.includes("meeting")
          ? "call"
          : activity.activity_type.includes("status")
            ? "status"
            : "note",
      title: activity.title,
      description: activity.description,
      dateLabel: new Date(activity.occurred_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      userLabel: "Walk-in experience",
      tag: activity.activity_type.replaceAll("_", " "),
      highlight: activity.activity_type === "status_changed",
      accountId,
      accountName: walkInAccounts.find((account) => account.id === accountId)?.name,
    }))
    .sort((a, b) => b.dateLabel.localeCompare(a.dateLabel));
}

function dedupeMemories(memories: RecalledMemory[], limit: number) {
  const seen = new Set<string>();
  const deduped: RecalledMemory[] = [];

  for (const memory of memories) {
    const key =
      memory.id ??
      `${memory.metadata.account_id}-${memory.metadata.source_type}-${memory.metadata.created_at}-${memory.content}`;

    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(memory);

    if (deduped.length >= limit) break;
  }

  return deduped;
}

function buildWalkInFallbackMemories(accountId: string, limit: number) {
  const accountNotes = walkInNotes
    .filter((note) => note.account_id === accountId)
    .map((note) => {
      const account = walkInAccounts.find((item) => item.id === note.account_id);
      const contact = walkInContacts.find((item) => item.id === note.contact_id);

      return {
        id: note.id,
        content: note.content,
        metadata: {
          workspace_id: note.workspace_id,
          account_id: note.account_id,
          contact_id: note.contact_id,
          source_type: note.source_type,
          topic: note.topic,
          importance_level: note.importance_level,
          stage: account?.stage ?? null,
          created_at: note.created_at,
          entity_type: "note",
          account_name: account?.name ?? null,
          contact_name: contact?.name ?? null,
          contact_role_type: contact?.role_type ?? null,
        },
      } satisfies RecalledMemory;
    });

  const accountActivities = walkInActivities
    .filter((activity) => activity.account_id === accountId)
    .map((activity) => {
      const account = walkInAccounts.find((item) => item.id === activity.account_id);
      const contact = walkInContacts.find((item) => item.id === activity.contact_id);

      return {
        id: activity.id,
        content: activity.description || activity.title,
        metadata: {
          workspace_id: activity.workspace_id,
          account_id: activity.account_id,
          contact_id: activity.contact_id,
          source_type: "activity_summary",
          topic:
            typeof activity.metadata.topic === "string"
              ? activity.metadata.topic
              : activity.activity_type,
          importance_level: "medium",
          stage: account?.stage ?? null,
          created_at: activity.occurred_at,
          entity_type: "activity",
          account_name: account?.name ?? null,
          contact_name: contact?.name ?? null,
          contact_role_type: contact?.role_type ?? null,
        },
      } satisfies RecalledMemory;
    });

  return dedupeMemories(
    [...accountNotes, ...accountActivities].sort(
      (a, b) =>
        new Date(b.metadata.created_at).getTime() - new Date(a.metadata.created_at).getTime(),
    ),
    limit,
  );
}

export function getWalkInOverviewData(): WorkspaceOverviewData {
  return {
    workspace: walkInWorkspace,
    profile: walkInProfile,
    accounts: walkInAccounts,
    contacts: walkInContacts,
    recent_activities: walkInActivities,
    recent_notes: walkInNotes,
    recent_outputs: walkInOutputs,
  };
}

export function getWalkInAccountPageData(accountId: string): AccountPageData | null {
  const account = walkInAccounts.find((item) => item.id === accountId);
  if (!account) return null;

  const contacts = walkInContacts.filter((contact) => contact.account_id === accountId);
  const notes = walkInNotes.filter((note) => note.account_id === accountId);
  const activities = walkInActivities.filter((activity) => activity.account_id === accountId);
  const outputs = walkInOutputs.filter((output) => output.account_id === accountId);
  const latest = outputs[0] ?? null;
  const fallbackMemories = buildWalkInFallbackMemories(accountId, 12);
  const memoryPool = dedupeMemories(
    [...(latest?.recalled_memories_json ?? []), ...fallbackMemories],
    12,
  );

  return {
    account,
    contacts,
    notes,
    activities,
    timeline: timelineForAccount(accountId),
    latest_output: latest,
    recent_outputs: outputs,
    memory_rail: memoryPool,
  };
}

export function getWalkInActionOutput(accountId: string, actionType: GeneratedOutput["action_type"]) {
  return (
    walkInOutputs.find(
      (output) => output.account_id === accountId && output.action_type === actionType,
    ) ?? null
  );
}

export function getWalkInRailMemories(limit = 6): RecalledMemory[] {
  const outputMemories = dedupeMemories(
    walkInOutputs.flatMap((output) => output.recalled_memories_json ?? []),
    limit,
  );

  if (outputMemories.length > 0) {
    return outputMemories;
  }

  const fallbackFromNotes = walkInNotes.slice(0, 6).map((note) => {
    const account = walkInAccounts.find((item) => item.id === note.account_id);
    const contact = walkInContacts.find((item) => item.id === note.contact_id);

    return {
      id: note.id,
      content: note.content,
      metadata: {
        workspace_id: note.workspace_id,
        account_id: note.account_id,
        contact_id: note.contact_id,
        source_type: note.source_type,
        topic: note.topic,
        importance_level: note.importance_level,
        stage: account?.stage ?? null,
        created_at: note.created_at,
        entity_type: "note",
        account_name: account?.name ?? null,
        contact_name: contact?.name ?? null,
        contact_role_type: contact?.role_type ?? null,
      },
    } satisfies RecalledMemory;
  });

  const fallbackFromActivities = walkInActivities.slice(0, 4).map((activity) => {
    const account = walkInAccounts.find((item) => item.id === activity.account_id);
    const contact = walkInContacts.find((item) => item.id === activity.contact_id);

    return {
      id: activity.id,
      content: activity.description || activity.title,
      metadata: {
        workspace_id: activity.workspace_id,
        account_id: activity.account_id,
        contact_id: activity.contact_id,
        source_type: "activity_summary",
        topic:
          typeof activity.metadata.topic === "string"
            ? activity.metadata.topic
            : activity.activity_type,
        importance_level: "medium",
        stage: account?.stage ?? null,
        created_at: activity.occurred_at,
        entity_type: "activity",
        account_name: account?.name ?? null,
        contact_name: contact?.name ?? null,
        contact_role_type: contact?.role_type ?? null,
      },
    } satisfies RecalledMemory;
  });

  return dedupeMemories(
    [...fallbackFromNotes, ...fallbackFromActivities].sort(
      (a, b) =>
        new Date(b.metadata.created_at).getTime() - new Date(a.metadata.created_at).getTime(),
    ),
    limit,
  );
}
