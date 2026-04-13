import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Pattern, Profile, Database } from "@/lib/supabase/types";

type PatternUpdate = Database["public"]["Tables"]["patterns"]["Update"];

// GET /api/patterns/:id — load a single pattern (own or public)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updates: PatternUpdate = { updated_at: new Date().toISOString() };

  if (body.title !== undefined) updates.title = body.title;
  if (body.code !== undefined) updates.code = body.code;
  if (body.mode !== undefined) updates.mode = body.mode;
  if (body.is_public !== undefined) updates.is_public = body.is_public;

  const { data, error } = await supabase
    .from("patterns")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
