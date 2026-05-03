import type { ContextMemoryType, ContextRailItem, RecalledMemory } from "@/types";

const BLOCKER_TOKENS = [
  "blocker",
  "blocked",
  "cannot proceed",
  "can't proceed",
  "risk",
  "security",
  "compliance",
  "soc2",
  "outage",
  "sla",
  "at_risk",
  "at risk",
];

const PREFERENCE_TOKENS = [
  "preference",
  "prefer",
  "communication",
  "tone",
  "style",
  "concise",
  "bullet",
  "executive summary",
  "summary requirement",
];

const COMMITMENT_TOKENS = [
  "commitment",
  "commit",
  "promise",
  "promised",
  "follow-up",
  "follow up",
  "next step",
  "agreed",
  "provide",
  "send",
];

const TOPIC_REASON_MAP: Array<[token: string, reason: string]> = [
  ["security", "Active blocker for current negotiation phase"],
  ["blocker", "Active blocker for current negotiation phase"],
  ["risk", "Time-sensitive account risk surfaced"],
  ["communication", "Matches chosen stakeholder persona"],
  ["preference", "Matches chosen stakeholder persona"],
  ["commitment", "Unfulfilled promise identified"],
  ["promise", "Unfulfilled promise identified"],
  ["pricing", "Commercial commitment requires follow-through"],
  ["deadline", "Time-sensitive external deadline"],
];

const MEMORY_THEME: Record<
  ContextMemoryType,
  {
    accentClassName: string;
    badgeClassName: string;
    iconClassName: string;
  }
> = {
  BLOCKER: {
    accentClassName: "border-l-[#991B1B]",
    badgeClassName: "bg-[#FDECEC]",
    iconClassName: "text-[#991B1B]",
  },
  PREFERENCE: {
    accentClassName: "border-l-[#2563EB]",
    badgeClassName: "bg-[#EAF1FF]",
    iconClassName: "text-[#2563EB]",
  },
  COMMITMENT: {
    accentClassName: "border-l-[#F97316]",
    badgeClassName: "bg-[#FFF4E8]",
    iconClassName: "text-[#F97316]",
  },
  CONTEXT: {
    accentClassName: "border-l-[#374151]",
    badgeClassName: "bg-[#F3F4F6]",
    iconClassName: "text-[#374151]",
  },
};

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function includesAny(value: string, tokens: string[]) {
  return tokens.some((token) => value.includes(token));
}

function formatUpperWords(value: string) {
  return value
    .replaceAll("_", " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(" ")
    .toUpperCase();
}

function getTopicReason(topic: string | null | undefined) {
  const normalized = normalize(topic);

  if (!normalized) return null;

  const match = TOPIC_REASON_MAP.find(([token]) => normalized.includes(token));
  return match?.[1] ?? null;
}

function getFirstName(name: string | null | undefined) {
  const cleaned = (name ?? "").trim();
  if (!cleaned) return null;
  return cleaned.split(/\s+/)[0] ?? null;
}

function toRoleLabel(value: string | null | undefined) {
  const normalized = normalize(value);
  if (!normalized) return "CONTACT";

  return normalized
    .split("_")
    .map((part) => part.toUpperCase())
    .join(" ");
}

function formatSourceLabel(value: string | null | undefined) {
  const normalized = normalize(value);
  return normalized ? formatUpperWords(normalized) : "MEMORY";
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) return "UNKNOWN";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "UNKNOWN";

  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

export function normalizeContactId(value: string | null | undefined) {
  const normalized = (value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

export function classifyContextMemory(memory: RecalledMemory): ContextMemoryType {
  const topic = normalize(memory.metadata.topic);
  const sourceType = normalize(memory.metadata.source_type);
  const content = normalize(memory.content);
  const blended = `${topic} ${sourceType} ${content}`;

  if (
    normalize(memory.metadata.importance_level) === "critical" ||
    normalize(memory.metadata.stage) === "at_risk" ||
    includesAny(blended, BLOCKER_TOKENS)
  ) {
    return "BLOCKER";
  }

  if (includesAny(blended, PREFERENCE_TOKENS)) {
    return "PREFERENCE";
  }

  if (includesAny(blended, COMMITMENT_TOKENS)) {
    return "COMMITMENT";
  }

  return "CONTEXT";
}

export function dedupeRecalledMemories(memories: RecalledMemory[]) {
  const seen = new Set<string>();
  const deduped: RecalledMemory[] = [];

  for (const memory of memories) {
    const key =
      memory.id ??
      `${memory.metadata.account_id}:${memory.metadata.contact_id ?? "common"}:${memory.metadata.source_type}:${memory.metadata.created_at}:${memory.content}`;

    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(memory);
  }

  return deduped;
}

export function mergeMemoryPools(
  current: RecalledMemory[],
  incoming: RecalledMemory[],
  max = 24,
) {
  return dedupeRecalledMemories([...incoming, ...current]).slice(0, max);
}

export function filterMemoriesForContact(
  memories: RecalledMemory[],
  selectedContactId: string | null | undefined,
  limit?: number,
) {
  const targetContactId = normalizeContactId(selectedContactId);

  const filtered = dedupeRecalledMemories(memories)
    .filter((memory) => {
      if (!targetContactId) return true;

      const memoryContactId = normalizeContactId(memory.metadata.contact_id);
      return memoryContactId === targetContactId || memoryContactId == null;
    })
    .sort(
      (left, right) =>
        new Date(right.metadata.created_at).getTime() -
        new Date(left.metadata.created_at).getTime(),
    );

  if (typeof limit === "number") {
    return filtered.slice(0, limit);
  }

  return filtered;
}

function deriveWhyRecalled(
  memory: RecalledMemory,
  type: ContextMemoryType,
  selectedContactId: string | null | undefined,
) {
  if (memory.metadata.integration_source === "gmail") {
    return "Recovered from Gmail thread context and matched account timeline";
  }

  if (memory.metadata.integration_source === "linkedin") {
    return "Recovered from LinkedIn stakeholder context for this account";
  }

  if (memory.metadata.integration_source === "outlook") {
    return "Recovered from Outlook email context for this account";
  }

  if (memory.metadata.integration_source === "slack") {
    return "Recovered from Slack signal context for this account";
  }

  const topicReason = getTopicReason(memory.metadata.topic);
  if (topicReason) return topicReason;

  const targetContactId = normalizeContactId(selectedContactId);
  const memoryContactId = normalizeContactId(memory.metadata.contact_id);

  if (targetContactId && memoryContactId === targetContactId) {
    return "Matches chosen stakeholder persona";
  }

  if (memoryContactId == null) {
    return "Account-wide context relevant to current workflow";
  }

  switch (type) {
    case "BLOCKER":
      return "Active blocker for current negotiation phase";
    case "PREFERENCE":
      return "Matches stakeholder communication preference";
    case "COMMITMENT":
      return "Unfulfilled promise identified";
    case "CONTEXT":
      return "High-signal context for this account";
  }
}

function buildRelationLabel(memory: RecalledMemory) {
  const firstName = getFirstName(memory.metadata.contact_name);
  if (!firstName) return null;

  const role = toRoleLabel(memory.metadata.contact_role_type);
  return `${role} (${firstName.toLowerCase()})`;
}

export function mapContextRailItems(input: {
  memories: RecalledMemory[];
  selectedContactId?: string | null;
}) {
  return input.memories.map((memory, index): ContextRailItem => {
    const type = classifyContextMemory(memory);
    const theme = MEMORY_THEME[type];
    const id =
      memory.id ??
      `${memory.metadata.account_id}:${memory.metadata.contact_id ?? "common"}:${memory.metadata.created_at}:${index}`;

    return {
      id,
      type,
      relationLabel: buildRelationLabel(memory),
      sourceLabel: formatSourceLabel(memory.metadata.source_type),
      dateLabel: formatDateLabel(memory.metadata.created_at),
      whyRecalled: deriveWhyRecalled(memory, type, input.selectedContactId),
      content: memory.content,
      accentClassName: theme.accentClassName,
      badgeClassName: theme.badgeClassName,
      iconClassName: theme.iconClassName,
      rawMemory: memory,
    };
  });
}
