import { NextRequest, NextResponse } from "next/server";

import { parseIntegrationProvider } from "@/lib/integrations/providers";
import { syncIntegrationProvider } from "@/lib/integrations/orchestrator";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  try {
    const { provider: rawProvider } = await params;
    const provider = parseIntegrationProvider(rawProvider);
    const result = await syncIntegrationProvider(provider);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        mode: "error",
        message: error instanceof Error ? error.message : "Failed to sync provider",
      },
      { status: 400 },
    );
  }
}
