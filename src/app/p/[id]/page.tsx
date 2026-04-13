import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Pattern, Profile } from "@/lib/supabase/types";

export default async function SharedPatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: patternData } = await supabase
    .from("patterns")
    .select()
    .eq("id", id)
    .eq("is_public", true)
    .single();

  const pattern = patternData as Pattern | null;

  if (!pattern) {
    redirect("/?error=not_found");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select()
    .eq("id", pattern.user_id)
    .single();

  const profile = profileData as Profile | null;
  const author = profile?.display_name || profile?.username || "anonymous";

  return (
    <div className="min-h-dvh bg-bg text-text flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="font-heading font-bold text-2xl text-lime tracking-tight mb-1">
          {pattern.title}
        </h1>
        <p className="text-xs text-text-dim mb-4">
          by {author} · {pattern.mode.toUpperCase()}
        </p>

        <pre className="bg-surface border border-border rounded-lg p-4 text-xs text-text overflow-x-auto mb-6 max-h-80 overflow-y-auto">
          {pattern.code}
        </pre>

        <a
          href={`/?load=${pattern.id}`}
          className="inline-block font-heading font-semibold text-xs tracking-wide bg-lime text-bg px-5 py-2.5 rounded-lg hover:brightness-110 transition"
        >
          OPEN IN PULSE.CITY
        </a>

        <p className="text-[0.6rem] text-text-dim mt-4">
          This pattern was shared from{" "}
          <a href="/" className="text-lime hover:underline">
            pulse.city
          </a>
        </p>
      </div>
    </div>
  );
}
