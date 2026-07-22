# Authentication

## Local setup - Sign In Canada

### Environment variables

#### `api/.env`

- Comment out block of variables 'for mock oauth testing'
- Uncomment block of variables 'for CanadaLogin testing'
- Add values for `OAUTH_API_CLIENT_ID` and `OAUTH_API_CLIENT_SECRET` (these can be obtained from a team member)

#### `apps/web/.env`

- Comment out the OAUTH_LOGOUT_URI line with the `localhost:8000` value
- Uncomment the OAUTH_LOGOUT_URI line with the `canada.ca` value
- Run `pnpm run dev` to update config values

## Local setup - CanadaLogin

### Environment variables

#### `api/.env`

- Comment out block of variables 'for mock oauth testing'
- Uncomment block of variables 'for CanadaLogin testing'
- Add values for `OAUTH_API_CLIENT_ID` and `OAUTH_API_CLIENT_SECRET` (these can be obtained from a team member)

#### `apps/web/.env`

- Comment out the OAUTH_LOGOUT_URI line with the `localhost:8000` value
- Uncomment the OAUTH_LOGOUT_URI line with the `cds-gcsignin-test.verify.ibm.com` value
- Run `pnpm run dev` to update config values

## Manual account promotion

1. Sign in with any authentication provider
2. Run `php artisan tinker` in `/api` directory
3. Run the following commands in tinker to add `base_user`, `applicant`, and `platform_admin` roles to the user. Replace *username@domain.tld* with email address associated with the account.

```
$user = User::where('email', 'username@domain.tld')->sole();
$user->addRoles(['base_user', 'applicant', 'platform_admin']);
$user->roles()->get()->pluck('name');
```
