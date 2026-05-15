# Navigation Plan

The prototype now uses React Navigation with this shape:

- Root stack
  - Onboarding stack
  - Lock screen
  - Main tabs
  - Post detail modal
  - Friend profile modal
  - Report modal
- Main tabs
  - Today
  - Friends
  - Posts
  - Profile
- Profile stack
  - Friends
  - Settings
  - Safety

Keep screen props thin by reading from service-backed hooks. This will make Supabase auth redirects, deep links, and push-notification opens much easier.

## Current Status

- Main tabs are handled by `@react-navigation/bottom-tabs`.
- Post detail and friend profile are handled by a root native stack.
- Onboarding and lock still render before the navigator because they depend on local boot/security state.
- A dedicated report modal can replace the current alert flow later.
