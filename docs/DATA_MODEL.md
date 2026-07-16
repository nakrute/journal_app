# OutLoud Local Data Model

These shapes describe the live-data contract to use when the app moves to Supabase or another backend.

Runtime code uses these canonical shapes. `services/entities.js` normalizes older local
records that used `photo`, and the existing `voiceReal.*` AsyncStorage namespace is
retained so prototype installs do not lose data.

## User

- `id`: stable auth user id
- `name`: display name
- `handle`: unique public handle
- `bio`: short profile text
- `avatarUri`: profile photo file URL
- `privacy`: private profile, discovery, friend requests
- `createdAt`, `updatedAt`

## Post

- `id`: post id
- `authorId`: user id
- `prompt`: daily prompt text
- `caption`: user caption
- `photoUri`: stored image URL
- `voiceUri`: stored audio URL
- `visibility`: `friends`, `close`, `private`, or `public`
- `createdAt`, `updatedAt`

## Friendship

- `id`: relationship id
- `requesterId`, `receiverId`
- `status`: `pending`, `accepted`, `blocked`
- `createdAt`, `updatedAt`

## Notification Preference

Friend profile records do not double as posts. The local demo adapter exposes the
most recent feed item as `friend.latestPost`; a backend should query posts by
`authorId` instead of embedding them in a profile.

- `userId`
- `dailyReminderEnabled`
- `dailyReminderTime`
- `friendPostsEnabled`
- `friendRequestsEnabled`
- `quietHoursEnabled`
- `quietHoursStart`, `quietHoursEnd`

## Report

- `id`
- `reporterId`
- `targetType`: `post` or `user`
- `targetId`
- `reason`
- `status`: `open`, `reviewed`, `actioned`
- `createdAt`
