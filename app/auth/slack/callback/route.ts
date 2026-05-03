import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getWorkspaceContext } from "@/lib/data/contextiq";
import { exchangeSlackCodeForToken, fetchSlackAuthIdentity } from "@/lib/slack/client";
import { upsertSlackIntegrationTokens } from "@/lib/slack/integration-store";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const cookieStore = await cookies();

  const expectedState = cookieStore.get("slack_oauth_state")?.value;
  const next = cookieStore.get("slack_oauth_next")?.value ?? "/overview";
  const safeNext = next.startsWith("/") ? next : "/overview";

  cookieStore.delete("slack_oauth_state");
  cookieStore.delete("slack_oauth_next");

  if (error) {
    return NextResponse.redirect(
      new URL(`/overview?integration=slack&status=error&message=${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(
      new URL("/overview?integration=slack&status=error&message=invalid_state", request.url),
    );
  }

  try {
    const [{ workspace, userId, profile }, token] = await Promise.all([
      getWorkspaceContext(),
      exchangeSlackCodeForToken({ code }),
    ]);

    const identity = await fetchSlackAuthIdentity({
      accessToken: token.accessToken,
    });

    await upsertSlackIntegrationTokens({
      workspaceId: workspace.id,
      userId,
      email: profile.email,
      teamId: token.teamId ?? identity.teamId,
      teamName: token.teamName ?? identity.teamName,
      accessToken: token.accessToken,
      tokenType: token.tokenType,
      scopes: token.scopes,
    });

    return NextResponse.redirect(new URL(`${safeNext}?integration=slack&status=connected`, request.url));
  } catch (callbackError) {
    const message = callbackError instanceof Error ? callbackError.message : "Slack connect failed";
    return NextResponse.redirect(
      new URL(`/overview?integration=slack&status=error&message=${encodeURIComponent(message)}`, request.url),
    );
  }
}
