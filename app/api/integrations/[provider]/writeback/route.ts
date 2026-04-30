import { NextRequest, NextResponse } from "next/server";

import { executeProviderWriteback } from "@/lib/integrations/orchestrator";
import { parseIntegrationProvider } from "@/lib/integrations/providers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  try {
    const { provider: rawProvider } = await params;
    const provider = parseIntegrationProvider(rawProvider);
    const payload = (await request.json()) as Record<string, unknown>;
    const result = await executeProviderWriteback({
      provider,
      payload,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        mode: "error",
        message: error instanceof Error ? error.message : "Failed to execute provider writeback",
      },
      { status: 400 },
    );
  }
}
