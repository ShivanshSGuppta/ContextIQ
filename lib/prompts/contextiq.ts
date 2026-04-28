import type { Account, ActionType, ActivityRecord, Contact, RecalledMemory } from "@/types";

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function buildActionPrompt(input: {
  actionType: ActionType;
  account: Account;
  contacts: Contact[];
  selectedContact: Contact | null;
  activities: ActivityRecord[];
  memories: RecalledMemory[];
  prompt?: string | null;
}) {
  const accountData = serialize(input.account);
  const contactData = serialize(input.selectedContact ?? input.contacts);
  const recentActivities = serialize(input.activities.slice(0, 8));
  const recalledMemories = serialize(input.memories);
  const optionalInstruction = input.prompt?.trim()
    ? `\nUser instruction:\n${input.prompt.trim()}\n`
    : "";

  switch (input.actionType) {
    case "prepare_meeting":
      return `You are generating a meeting preparation brief for a customer-facing user.

Use only:
1. the structured account/contact data provided
2. the recalled contextual memories provided

Do not invent facts.
${optionalInstruction}
Return a concise but useful meeting brief with the following sections:
- Objective
- Key talking points
- Risks / blockers
- Promises or commitments to mention
- Recommended tone
- Suggested next step

Account data:
${accountData}

Contact data:
${contactData}

Recalled memories:
${recalledMemories}`;
    case "draft_followup":
      return `You are drafting a follow-up message for a customer-facing workflow.

Use only:
1. the structured account/contact data
2. the recalled contextual memories

Do not invent facts.
${optionalInstruction}
Write a concise follow-up message that reflects:
- known preferences
- blockers
- commitments already made
- current deal/account context

Account data:
${accountData}

Contact data:
${contactData}

Recalled memories:
${recalledMemories}`;
    case "summarize_blockers":
      return `Summarize the current blockers affecting this account.

Use only the structured account data and recalled memories.
Do not invent anything.
${optionalInstruction}
Return:
- Current blockers
- Severity
- Likely owner
- Suggested resolution focus

Account data:
${accountData}

Recalled memories:
${recalledMemories}`;
    case "what_changed_recently":
      return `Summarize what changed recently for this account based only on the provided activities, notes, and recalled memories.
${optionalInstruction}
Return:
- New developments
- Newly introduced risks
- Shifts in stakeholder stance
- Immediate implications

Account data:
${accountData}

Recent activity data:
${recentActivities}

Recalled memories:
${recalledMemories}`;
  }
}
