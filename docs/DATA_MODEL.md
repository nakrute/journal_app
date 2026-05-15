# OutLoud Local Data Model

These shapes describe the live-data contract to use when the app moves to Supabase or another backend.

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
