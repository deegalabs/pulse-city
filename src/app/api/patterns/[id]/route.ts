import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Pattern, Profile, Database } from "@/lib/supabase/types";
import { asString, isUuid, safeJson } from "@/lib/server/validation";

type PatternUpdate = Database["public"]["Tables"]["patterns"]["Update"];
const ALLOWED_MODES = new Set(["autopilot", "manual"]);

// GET /api/patterns/:id — load a single pattern (own or public)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
  }

  const supabase = await createClient();

  // Get user first to check access
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("patterns")
    .select()
    .eq("id", id)
    .single();

  const pattern = data as Pattern | null;

  if (error || !pattern) {
    if (error) console.error("Pattern GET failed:", error);
    return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
  }

  // Public patterns visible to all, private only to owner
  if (!pattern.is_public && pattern.user_id !== user?.id) {
    return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
  }

  // Fetch author profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select()
    .eq("id", pattern.user_id)
    .single();

  const profile = profileData as Profile | null;

  return NextResponse.json({
    ...pattern,
    author: profile
      ? { display_name: profile.display_name, username: profile.username }
      : null,
  });
}

// PATCH /api/patterns/:id — update own pattern
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await safeJson(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body as {
    title?: unknown;
    code?: unknown;
    mode?: unknown;
    is_public?: unknown;
  };

  const updates: PatternUpdate = { updated_at: new Date().toISOString() };
  let hasUpdate = false;

  if (raw.title !== undefined) {
    const title = asString(raw.title, 120);
    if (!title) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    updates.title = title;
    hasUpdate = true;
  }

  if (raw.code !== undefined) {
    const code = asString(raw.code, 40_000);
    if (!code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
    updates.code = code;
    hasUpdate = true;
  }

  if (raw.mode !== undefined) {
    if (typeof raw.mode !== "string" || !ALLOWED_MODES.has(raw.mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }
    updates.mode = raw.mode as "autopilot" | "manual";
    hasUpdate = true;
  }

  if (raw.is_public !== undefined) {
    if (typeof raw.is_public !== "boolean") {
      return NextResponse.json({ error: "Invalid is_public" }, { status: 400 });
    }
    updates.is_public = raw.is_public;
    hasUpdate = true;
  }

  if (!hasUpdate) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("patterns")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Pattern PATCH failed:", error);
    return NextResponse.json({ error: "Failed to update pattern" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// DELETE /api/patterns/:id — delete own pattern
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("patterns")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Pattern DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete pattern" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
