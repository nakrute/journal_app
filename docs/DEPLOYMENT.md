# OutLoud Deployment

This project is configured for Expo Application Services builds.

## One-Time Setup

1. Create or sign into an Expo account.
2. From the project folder, run `npx eas-cli login`.
3. Run `npx eas-cli init` if the project is not linked to an EAS project yet.
4. Confirm the app identifiers before public release:
   - iOS bundle id: `com.outloud.app`
   - Android package: `com.outloud.app`
5. Replace the generated first-pass assets in `assets/` with final brand artwork before store submission.

## Local Checks

Run these before every build:

```bash
npm test
npm run export:android
npm run doctor
```

## Development Build

Use this for testing native behavior such as notifications outside Expo Go.

```bash
npm run build:android:dev
npm run start:dev
```

## Internal Android Preview

Use this to create an installable APK for testers.

```bash
npm run build:android:preview
```

## Production Builds

Android:

```bash
npm run build:android:production
```

iOS:

```bash
npm run build:ios:production
```

## Store Submission

Android:

```bash
npm run submit:android
```

iOS:

```bash
npm run submit:ios
```

## Current Release Caveats

- Data is still local-only; account sync, backend media storage, and real multi-user delivery are not live yet.
- Remote push notifications still need backend fanout.
- App Store and Play Store legal text, privacy policy URL, support URL, screenshots, and age rating still need final content.
