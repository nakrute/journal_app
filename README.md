# VoiceReal

VoiceReal is a mobile-first MVP inspired by spontaneous daily photo apps, with voice messages as the main social layer.

## What is included

- Expo/React Native app scaffold
- Daily prompt screen with camera capture
- Voice note recording and playback
- Friend feed with photo posts and voice-message UI
- Local prototype state for posting your own moment

## Run it

This workspace currently has Node.js available, but no JavaScript package manager on PATH. Once `npm`, `pnpm`, or `yarn` is installed, run:

```bash
npm install
npm run start
```

Then open the project in Expo Go on your phone, or run the iOS/Android simulator from the Expo terminal.

This scaffold targets Expo SDK 55, React 19.2, and React Native 0.83.

## Product direction

For a production version, the next pieces are:

- Accounts and friend graph
- Push notification for the daily drop
- Backend storage for photos and audio clips
- Real-time delivery for voice messages
- Moderation, blocking, and privacy controls
- Native dual-camera capture where supported

See `docs/MVP.md` for the first production build plan.
