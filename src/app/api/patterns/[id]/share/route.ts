import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Pattern } from "@/lib/supabase/types";
import { isUuid } from "@/lib/server/validation";

// POST /api/patterns/:id/share — toggle public sharing
export async function POST(
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

  // Get current state
  const { data: patternData } = await supabase
    .from("patterns")
    .select()
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const pattern = patternData as Pattern | null;

  if (!pattern) {
    return NextResponse.json({ error: "Pattern not found" }, { status: 404 });
  }

  // Toggle
  const newState = !pattern.is_public;

  const { error } = await supabase
    .from("patterns")
    .update({ is_public: newState, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Pattern share toggle failed:", error);
    return NextResponse.json({ error: "Failed to update sharing" }, { status: 500 });
  }

  return NextResponse.json({ is_public: newState, share_url: newState ? `/p/${id}` : null });
}
