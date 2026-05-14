# OutLoud

OutLoud is a mobile-first MVP inspired by spontaneous daily photo apps, with voice messages as the main social layer.

## What is included

- Expo/React Native app scaffold
- Daily prompt screen with camera capture
- Voice note recording and playback
- Friend feed with photo posts and voice-message UI
- Local profile, draft, post, friend, and setting persistence
- First-run onboarding
- Local post editing and deletion
- Post detail view with voice playback
- Permission status cards, privacy toggles, demo reset controls, and optional local PIN lock
- Prompt history for recent daily check-ins
- Local activity log and bug-bash tools for stress testing states
- App-owned media copies for captured photos and voice notes
- Composer cleanup controls and basic post sharing
- Mock new-friend-post simulator
- Local daily reminder notifications
- Local prototype state for posting your own moment

## Run it

This workspace uses Expo SDK 54. Run:

```bash
npm install
npm run start
```

Then open the project in Expo Go on your phone, or run the iOS/Android simulator from the Expo terminal.

Run the local utility tests with:

```bash
npm test
```

This scaffold targets Expo SDK 54, React 19.1, and React Native 0.81.

Notifications can be tested from Profile > Settings with the daily reminders toggle or the test notification button. Expo Go has notification limitations on newer SDKs, especially for remote push on Android, so a development build is the better test target when we move beyond local reminders.

## Development build

The project includes `expo-dev-client` so Android notification behavior can be tested outside Expo Go.

```bash
npm run dev:android
npm run start:dev
```

For iOS, use:

```bash
npm run dev:ios
npm run start:dev
```

## Product direction

For a production version, the next pieces are:

- Accounts and friend graph
- Server push notification for the daily drop
- Backend storage for photos and audio clips
- Real-time delivery for voice messages
- Moderation, blocking, and privacy controls
- Native dual-camera capture where supported

See `docs/MVP.md` for the first production build plan.
