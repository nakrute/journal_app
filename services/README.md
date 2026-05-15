# Local Services

These modules are the swap point for a future backend. Hooks still persist to local AsyncStorage today, but entity creation and mutation logic lives here so Supabase can replace storage without rewriting screens.

- `postsService`: post creation, caption updates, prompt archive records
- `friendsService`: friend creation, duplicate checks, close-friend mutation
- `reportsService`: report creation
- `profileService`: profile field normalization
- `ids`: local IDs and timestamps
