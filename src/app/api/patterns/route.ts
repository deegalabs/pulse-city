import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    return NextResponse.json({ error: error.message }, { status: 500 });
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

  const body = await request.json();
  const { title, code, mode } = body;

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("patterns")
    .insert({
      user_id: user.id,
      title: title || "Untitled",
      code,
      mode: mode || "autopilot",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
