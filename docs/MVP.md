# OutLoud MVP

## Core idea

OutLoud is a mobile app where friends get a daily prompt to post a candid photo and attach a short voice note. The voice note is the emotional layer: users can react, explain, joke, or check in without turning the app into a polished social feed.

## First release scope

- Regular photo-and-voice composer, with optional daily-prompt behavior behind a feature flag
- Camera capture for the daily moment
- Short voice note recording
- Friend feed with photo plus audio playback
- Friend requests and private friend graph
- Push notification when the daily drop opens
- Basic reporting, blocking, and privacy settings

## Suggested stack

- Expo React Native for iOS and Android
- Supabase or Firebase for auth, database, and file storage
- Cloud storage buckets for photos and audio
- Push notifications through Expo Notifications

## Data model draft

- `users`: profile, handle, avatar, created date
- `friendships`: requester, recipient, status
- `daily_prompts`: prompt text, opens at, closes at
- `posts`: user, prompt, photo URL, audio URL, posted at, late flag
- `voice_replies`: post, sender, audio URL, duration, created at

## Near-term build order

1. Finalize repository contracts and canonical profile, post, and friendship shapes.
2. Add auth and real profiles behind the `realAuth` feature flag.
3. Upload photos and audio behind the `mediaUpload` feature flag.
4. Render real friend feed data from the backend.
5. Add push notifications only when daily-drop behavior is enabled.
6. Add remote friend search, requests, blocking, and reporting.
