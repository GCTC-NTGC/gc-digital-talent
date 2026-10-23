/**
 * Detects whether the API under test is using dummy auth, so tests that need a
 * real auth provider (like token refresh) can skip themselves.
 *
 * An empty body is rejected with 422 when the dummy token route exists and 404
 * when it doesn't, so this never creates a user.
 */
export default async () => {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:8000";
  const res = await fetch(`${baseUrl}/api/dummy-auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: "{}",
  });
  process.env.PLAYWRIGHT_DUMMY_AUTH = String(res.status === 422);
};
