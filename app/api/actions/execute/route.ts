import { NextRequest, NextResponse } from "next/server";

import { executeCrossToolAction } from "@/lib/integrations/orchestrator";
import type { CrossToolActionRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CrossToolActionRequest;
    const result = await executeCrossToolAction(payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to execute action",
      },
      { status: 400 },
    );
  }
}
