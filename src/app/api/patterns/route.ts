import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { asString, safeJson } from "@/lib/server/validation";

const ALLOWED_MODES = new Set(["autopilot", "manual"]);

// GET /api/patterns — list current user's patterns
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("patterns")
    .select()
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Patterns GET failed:", error);
    return NextResponse.json({ error: "Failed to load patterns" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/patterns — create a new pattern
export async function POST(request: Request) {
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

  const raw = body as { title?: unknown; code?: unknown; mode?: unknown };
  const code = asString(raw.code, 40_000);
  const title = asString(raw.title, 120) ?? "Untitled";
  const mode = typeof raw.mode === "string" ? raw.mode : "autopilot";

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  if (!ALLOWED_MODES.has(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("patterns")
    .insert({
      user_id: user.id,
      title,
      code,
      mode: mode as "autopilot" | "manual",
    })
    .select()
    .single();

  if (error) {
    console.error("Patterns POST failed:", error);
    return NextResponse.json({ error: "Failed to create pattern" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
