import { createClient } from "@/lib/supabase/server";
import type { Pattern, Profile } from "@/lib/supabase/types";
import { EmbedWidget } from "./embed-widget";

export default async function EmbedPage({
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
    return (
      <div className="w-full h-full bg-base flex items-center justify-center">
        <span className="font-micro text-[10px] text-text-dim tracking-widest">
          PATTERN NOT FOUND
        </span>
      </div>
    );
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select()
    .eq("id", pattern.user_id)
    .single();

  const profile = profileData as Profile | null;
  const author = profile?.display_name || profile?.username || "anonymous";

  return (
    <EmbedWidget
      title={pattern.title}
      author={author}
      code={pattern.code}
      patternId={pattern.id}
    />
  );
}
