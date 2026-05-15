# OutLoud QA Checklist

Run this list before sharing a build.

## Daily Post

- Launch app from a clean install
- Complete onboarding with name, handle, bio, and profile photo
- Grant camera and microphone permissions
- Capture, retake, and remove a photo
- Record, play, pause, replace, and remove a voice note
- Confirm the 60-second recording cap stops recording
- Edit caption and verify 90-character limit
- Publish as Friends, Close, Private, and Public
- Add a daily post to regular Posts

## Social

- Add a friend by handle
- Accept and decline requests
- Mark/unmark close friends
- Open a friend profile
- Remove and block a friend
- Simulate a friend post
- Report a post and a profile

## Settings

- Toggle dark mode
- Change daily reminder time
- Toggle friend-post alerts, friend-request alerts, and quiet hours
- Validate quiet-hours format
- Reset onboarding
- Enable and unlock app lock

## Reliability

- Restart the app and verify local data persists
- Delete local posts and verify media cleanup does not remove the profile photo
- Try playing a missing audio URI from Bug bash
- Check Android Expo Go notification fallback copy
- Run `npm.cmd test -- --runInBand`
- Run `node node_modules\expo\bin\cli export --platform android --clear`
