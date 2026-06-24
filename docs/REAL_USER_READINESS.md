# Real User Readiness

This checklist tracks the pieces OutLoud should have in place before real accounts, friend graphs, and backend media are connected.

## Added in the local prototype

- Local account lifecycle controls: export data, sign-out placeholder, delete local account data, terms placeholder, and privacy placeholder.
- Optional beta access mode with a local invite code.
- Backend-shaped local service helpers for mock upload metadata, outgoing friend requests, and blocked profiles.
- Visible post upload states: queued, failed, retried, uploaded, and deleted-ready.
- Friend request center for incoming and sent requests.
- Blocked profile management in the Friends profile section.
- Permission explanations for camera, microphone, and notifications.
- Profile privacy controls for friend requests, discovery, default post visibility, voice playback, close-friends voice, activity status, archive, and reminders.
- Safety controls for support contact visibility, report reason requirements, hiding blocked profiles, and hiding reported content.
- Admin-only Debug settings based on local admin handles.
- Local crash boundary with a remote crash reporting reminder.

## Backend integration targets

- Replace dummy sign-out with provider sign-out.
- Move OAuth/session tokens into encrypted device storage.
- Replace local admin handles with backend roles or auth claims.
- Store profile, post, friend, report, and media ownership by authenticated user id.
- Replace local mock upload state with a durable upload queue backed by storage retries.
- Enforce visibility, voice access, blocking, and reporting through server policies.
- Add production privacy policy, terms, community rules, support contact, data export, and account deletion flows.
- Add remote crash reporting and upload failure telemetry.
- Add explicit loading, empty, offline, upload failed, audio unavailable, deleted content, and permission denied states for every backend-backed surface.
