# Local Services

These modules are the swap point for a future backend. Hooks still persist to local AsyncStorage today, but entity creation and mutation logic lives here so Supabase can replace storage without rewriting screens.

Canonical entity adapters live in `entities.js`. Local repository implementations
encapsulate post and social mutations. The `voiceReal.*` storage namespace is
centralized in `constants/storageKeys.js` and retained for compatibility.

- `postsService`: post creation, caption updates, prompt archive records
- `friendsService`: friend creation, duplicate checks, close-friend mutation
- `reportsService`: report creation
- `profileService`: profile field normalization
- `ids`: local IDs and timestamps
