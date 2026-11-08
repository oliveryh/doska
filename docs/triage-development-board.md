# Development board triage

Triage of the open Doska cards on the **Development** board, as of 2026-11-08
(fork `main` at `4ce8dd9`). Read-only: nothing on the board was changed.

Each verdict was checked against the code and recent CI runs. Where something
could not be confirmed, it says so.

**Scope.** 14 open Doska repo cards are covered. Cards that are not about this
repo are listed at the end and left alone.

Effort: **S** under an hour, **M** a few hours, **L** a day or more.

## Summary

| #   | Card                                  | Verdict                   | Effort | Suggested priority |
| --- | ------------------------------------- | ------------------------- | ------ | ------------------ |
| 24  | Fix lint CI step                      | Likely resolved           | -      | close              |
| 14  | Fix failing CI                        | Mostly resolved, e2e open | S      | medium             |
| 11  | Fix failing CI when deploying         | Likely resolved           | -      | close              |
| 25  | Reduce time/tokens to release changes | Decided, convert to docs  | -      | close              |
| 12  | Show total non-complete card count    | Ready                     | S      | medium (up)        |
| 36  | Calendar starts on Monday             | Ready                     | S      | medium             |
| 15  | Preserve sidebar scroll position      | Ready                     | S      | low                |
| 13  | Settings in line with avatar          | Ready                     | S      | low                |
| 17  | Store Upcoming filter in state        | Ready (needs a choice)    | S/M    | low                |
| 19  | Incomplete count by priority          | Ready                     | S/M    | low                |
| 20  | Created at timestamp                  | Ready, follows card 6     | M      | medium             |
| 27  | Occasionally sync all boards          | Needs investigation       | M      | low                |
| 16  | Ctrl+K search global by default       | Needs investigation       | M      | medium             |
| 30  | Align padding on mobile               | Needs detail              | ?      | low                |

Suggested order: **12, 36, 15, 13** (quick wins), then **20**, then **17, 19**.
Investigate **16** and **27** before committing to them.

## CI cards

Recent runs on the fork: `Lint` failed twice on PR #7, then passed on the PR and
on `main`. `Build`, `Test`, `Lint` and the image publish are all green on
`main`. The lint failure was `pnpm type-check` hitting `tsc: command not found`
in packages that do not declare `typescript`. Adding it to the root
`devDependencies` (PR #7) fixed it.

### #24 Fix lint CI step: likely resolved

`lint.yml` runs `pnpm lint` then `pnpm type-check`. The failing step was the
type check, fixed by PR #7. Confirm with one more green PR run, then close.

### #14 Fix failing CI: mostly resolved, e2e is the open part

PR and `main` runs for Lint, Build and Test are green. The card also mentions an
e2e run on `main` taking an hour. `e2e.yml` triggers on every push to `main`,
runs `pnpm e2e`, and has no `timeout-minutes`. No e2e run appeared in the 12
most recent runs, so I could not check the current duration.

Suggested fix (S): add `timeout-minutes` to the job, and consider
`paths:` filtering or running only on tags so it does not run on every merge.

### #11 Fix failing CI when deploying: likely resolved

`images.yml` runs on version tags. The latest publish, `v0.27.5-oliveryh.2`,
succeeded. Close unless the failure was something other than the image build.

## Decided

### #25 Reduce time/tokens to release changes

The card body records the decision: drop the full typecheck, lint, test and
prettier loop on every change, and run only scoped checks that finish in
seconds. It says this is written up in `AI/CLAUDE.md`, which is not in this
repository, so I could not verify it. The five checkboxes are superseded by that
decision. Suggest closing the card, or collapsing it to the one decision.

## Ready to implement

### #12 Show total non-complete card count (S)

`useIncompleteCounts` (`packages/core/src/data/queries.ts:229`) returns a
per-board map, and `dashboards-list.tsx:38` consumes it. Nothing in
`components/sidebar` renders a total. Sum the map values and show one figure.

Note: card #21's body says the sidebar shows a "total" badge. In this code it
does not, so that wording is inaccurate. This card is still open work.

### #36 Make calendar start on Monday (S)

There is no `weekStartsOn` anywhere in the repo. The deadline picker
(`apps/client/src/components/card/menu/deadline-calendar.tsx`) renders the
shared `Calendar` from `@doska/ui-kit`. Setting the week start there (or as the
ui-kit default) should cover it. I did not open the ui-kit component, so check
which date library it wraps and whether other screens use a separate calendar.

### #15 Preserve scroll position on sidebar (S)

No scroll restoration exists in the client or ui-kit; the only `scrollTo` is the
viewport reset in `lib/app-height.ts`. The mobile drawer remounts its content on
open. Keep the scroll offset in a module-level ref or small store and restore it
on mount.

### #13 Put settings in line with avatar (S)

UI-only change in `app-sidebar.tsx` (footer: `SettingsButton` and
`SidebarAccount`).

### #17 Store Upcoming filter selection (S for local, M for shared)

`digest-view.tsx:24-26` keeps `filter`, `hideDone` and `priorityFilters` in
`useState`, so they reset on every visit. The card allows local storage or
the database. Local storage is the simpler option and is enough for one
person on one device. The database option would sync across devices but needs a
schema change. Decide first.

### #19 Incomplete count grouped by priority (S/M)

`getIncompleteCounts` (`packages/core/src/api/operations/get-digest.ts:237`)
already does the traversal and the `excludeBacklog` filter. Extending it to
bucket by priority is small. The unanswered question is where it shows: a
tooltip on the board count, or a separate figure. Needs a design decision.

### #20 Created at timestamp (M)

Cards carry `completedAt` (`packages/contract/src/schemas.ts:97`) but no
creation time. `createdAt` exists only on history entries, which are purged by
age, so history is not a reliable source. Follow the pattern card #6 used for
`completedAt`: contract field, server migration, sync read and write paths, and
its own merge group. Existing cards will need a backfill or a null default.

## Needs investigation

### #16 Make Ctrl+K search global by default (M)

`useSearchShortcut` (`lib/hooks/use-search-shortcut.ts`) is mounted from
`deck/deck-header/search-button.tsx`, so the overlay is opened from inside a
board. I did not read `components/search` to confirm whether results are
board-scoped. First step: read it, then decide whether global search needs a
new query or only a different default scope.

### #27 Occasionally sync all boards (M)

Counts come from local data and refresh only when a board is visited. The
codebase has no data polling: the only interval is the app update check in
`lib/update-store.ts`. A periodic background sync of all boards is feasible
but touches the sync layer, so look at how and when sync runs today before
choosing between polling, focus-triggered refresh, or a post-sync invalidation.

### #30 Align padding on mobile

Empty body. Needs a screenshot or a list of the screens that are misaligned
before it can be estimated.

## Board hygiene (suggestions only)

- Cards **#5** (Fork Doska) and **#4** (Priority Filter) sit in the Done column
  with no `completedAt`. #4 has all four tasks ticked. #5 has one unticked task
  (make the GHCR packages public or log in on the VPS).
- Card **#21** still carries a "Paused (1 Nov)" paragraph describing uncommitted
  local work. The same body says it later shipped in PR #6. Drop the stale
  paragraph.

## Not part of this repo

Left untouched: #37 NixOS Remove Spotify, #35 Personal MBP disk full,
#34 Claude improvements, #29 Update Nix versions, #28 Add swap to the VPS,
#26 Root TV, #18 Emoji Toolbar Obsidian plugin score, #3 Nix update across
devices, #2 and #1 `ft` CLI bugs.

Card #28 is the only one here that affects this repo: the VPS has no swap and
release work has been OOM-killing processes. It needs `sudo` on the VPS.
