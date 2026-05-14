import { createClient } from "@supabase/supabase-js";

// Guard against missing environment variables to avoid opaque Supabase errors at runtime.
const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
	process.env.SUPABASE_ANON_KEY;

const missingConfigMessage =
	"Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.";

const createMissingError = () => new Error(missingConfigMessage);

const createMissingResult = (data = null) => ({
	data,
	error: createMissingError(),
});

const createChainableMissingQuery = () => {
	const chain = new Proxy(function missingQuery() {}, {
		get(_target, prop) {
			if (prop === "then") {
				return (resolve) => resolve(createMissingResult());
			}

			if (
				[
					"select",
					"order",
					"eq",
					"insert",
					"update",
					"delete",
					"single",
					"maybeSingle",
					"limit",
					"range",
					"filter",
					"match",
					"ilike",
					"like",
					"gte",
					"lte",
					"gt",
					"lt",
					"not",
					"in",
					"or",
					"and",
					"contains",
					"is",
					"csv",
					"textSearch",
					"upsert",
				].includes(prop)
			) {
				return () => chain;
			}

			return chain;
		},
		apply() {
			return chain;
		},
	});

	return chain;
};

const createMissingAuth = () => ({
	getSession: () =>
		Promise.resolve({
			data: { session: null },
			error: createMissingError(),
		}),
	signInWithPassword: () => Promise.resolve(createMissingResult({ session: null, user: null })),
	signOut: () => Promise.resolve(createMissingResult(null)),
	getUser: () =>
		Promise.resolve({
			data: { user: null },
			error: createMissingError(),
		}),
});

const createMissingStorageBucket = () => ({
	upload: () => Promise.resolve(createMissingResult(null)),
	getPublicUrl: () => ({
		data: { publicUrl: "" },
	}),
});

const createMissingSupabaseClient = () => {
	const query = createChainableMissingQuery();

	return {
		from: () => query,
		auth: createMissingAuth(),
		storage: {
			from: () => createMissingStorageBucket(),
		},
	};
};

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

if (!hasSupabaseConfig) {
	console.warn(missingConfigMessage);
}

export const supabase = hasSupabaseConfig
	? createClient(supabaseUrl, supabaseKey)
	: createMissingSupabaseClient();
