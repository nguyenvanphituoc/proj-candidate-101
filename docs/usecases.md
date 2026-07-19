# Use Case Design

Business rules only, no implementation detail. Each use case is the single entry
point for its flow - screens never call repositories directly.

---

## UC-01 Login

Actor: unauthenticated user

Trigger: submits username + password on login screen

Preconditions
- both fields pass client validation (non-empty, password min length)

Flow
1. exchange credentials for access token
2. fetch my profile with that token
3. take org token from first membership
4. store access token + org token + expiry as one session, securely
5. report success -> app switches to main stack (invoice list)

Errors
- wrong credentials -> "invalid username or password", stay on login
- profile ok but no membership -> treat as login failure, nothing stored
- network down -> retryable error message

Rules
- session is all-or-nothing: never persist access token without org token
- credentials are never stored, only tokens
- tokens never appear in logs

---

## UC-02 Get My Profile

Actor: authenticated user

Trigger: called inside login (step 2), or profile screen if we add one

Flow
1. request current user with access token
2. return user with memberships

Errors
- 401 -> session expired, force logout
- membership list empty -> error, caller decides (login treats it as failure)

Rules
- read only, no side effects

---

## UC-03 Restore Session (app start)

Actor: system

Trigger: app cold start

Flow
1. read stored session
2. no session or expired -> land on login
3. valid session -> land on invoice list

Rules
- no network call needed, expiry check is local
- expired session gets cleared, not reused

---

## UC-04 Logout

Actor: authenticated user

Flow
1. clear stored session
2. clear all cached server data
3. back to login screen

Rules
- must work offline (local clear only)

---

## UC-05 List Invoices

Actor: authenticated user

Trigger: landing on home screen, pull to refresh, scroll to bottom,
changing search / filter / sort

Input: page, page size, sort field + direction, optional keyword,
status filter, date range

Flow
1. fetch one page matching the input
2. return invoices + whether more pages exist

Defaults
- sorted by created date, newest first
- page size 10

Errors
- 401 -> force logout
- other failures -> error state with retry, keep already-loaded pages

Rules
- keyword searches invoice number
- empty result is a valid state (show empty view), not an error

---

## UC-06 Create Invoice

Actor: authenticated user

Trigger: submits create invoice form

Preconditions (validation, all client side)
- invoice number required
- invoice date + due date required, due date >= invoice date
- exactly one line item, quantity > 0, rate > 0
- customer email valid format if entered

Flow
1. build full invoice payload from form draft
2. submit to invoice service
3. on success -> confirmation message to user, invoice list must refresh
4. navigate back to list

Errors
- validation rejected by server (e.g. duplicate invoice number) -> show
  server message on form, keep user input
- 401 -> force logout
- network error -> allow retry without losing the form

Rules
- one line item per invoice, enforced by the form itself
- amounts entered as numbers, no currency math done client side