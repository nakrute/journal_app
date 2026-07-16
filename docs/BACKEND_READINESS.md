# Backend Readiness

OutLoud is still local-first, but the code now has service modules under `services/` that define the backend-facing entity operations.

`localPostsRepository` and `localSocialRepository` are the current local
implementations. Screens continue consuming hook operations; future remote hooks can
delegate to Supabase repositories while preserving those screen contracts.

## Supabase Swap Points

- Replace AsyncStorage-backed hooks with Supabase queries/mutations.
- Keep screen props the same where possible.
- Move media from app-owned local files to Supabase Storage buckets.
- Convert local IDs to UUIDs from database rows.
- Add auth user IDs to profile, post, friendship, notification preference, and report records.

## Suggested Tables

- `profiles`
- `posts`
- `friendships`
- `friend_requests`
- `notification_preferences`
- `reports`
- `blocks`
- `close_friends`

## Storage Buckets

- `post-photos`
- `voice-notes`
- `profile-photos`

## Edge Functions Later

- Daily prompt assignment
- Push notification fanout
- Report escalation
- Media cleanup
