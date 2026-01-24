import { createClient } from "@supabase/supabase-js";

// Guard against missing environment variables to avoid opaque Supabase errors at runtime.
const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
	process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error(
		"Supabase URL missing. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) in your environment."
	);
}

if (!supabaseKey) {
	throw new Error(
		"Supabase anon key missing. Set NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY) in your environment."
	);
}

export const supabase = createClient(supabaseUrl, supabaseKey);