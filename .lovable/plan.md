

# Fix Analytics Dashboard

## Problem
The analytics dashboard is broken because the `get-analytics` backend function crashes silently. It uses `supabase.auth.getClaims()`, a method that doesn't exist in the version of the library being used. This causes the function to return a 404 error, meaning no analytics data ever reaches the admin dashboard.

The page tracking side (recording visits) works fine -- there are already page views stored in the database.

## What I'll Do

### 1. Fix the `get-analytics` backend function
Replace the broken `getClaims()` call with `supabase.auth.getUser()`, which is the correct way to verify the logged-in user's identity. This is a small but critical change.

### 2. Redeploy and verify
After fixing the code, I'll redeploy the function and test it to confirm it returns analytics data successfully.

### 3. Verify the admin dashboard loads data
Confirm the frontend analytics page correctly fetches and displays the data.

---

## Technical Details

**File changed:** `supabase/functions/get-analytics/index.ts`

**Current (broken):**
```typescript
const token = authHeader.replace('Bearer ', '')
const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
const userId = claimsData.claims.sub
```

**Fixed:**
```typescript
const { data: { user }, error: userError } = await supabase.auth.getUser()
if (userError || !user) { return 401 }
const userId = user.id
```

No other files need to change. The frontend hook (`useAnalyticsData`) and dashboard page are already wired up correctly -- they just need the backend function to actually respond.

