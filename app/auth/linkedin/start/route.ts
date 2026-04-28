import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  buildLinkedInConnectUrl,
  buildLinkedInOAuthState,
} from "@/lib/linkedin/client";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/") ? next : "/overview";
  const state = buildLinkedInOAuthState();
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("linkedin_oauth_state", state, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  cookieStore.set("linkedin_oauth_next", safeNext, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  const redirectUrl = buildLinkedInConnectUrl({ state });
  return NextResponse.redirect(redirectUrl);
}
