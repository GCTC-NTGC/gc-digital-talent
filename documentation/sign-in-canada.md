# Sign In Canada

## Local setup

### Environment variables

#### `api/.env`

- Comment out block of variables 'for mock oauth testing'
- Uncomment block of variables 'for SiC testing'
- Change `OAUTH_ACR_VALUES=gckeymfa` to `OAUTH_ACR_VALUES=gckey`
- Add values for `OAUTH_API_CLIENT_ID` and `OAUTH_API_CLIENT_SECRET` (these can be obtained from @tristan-orourke)

#### `apps/web/.env`

- Comment out block of variables 'Mock auth endpoint'
- Uncomment block of variables 'SiC endpoint (will break e2e tests)'
- Run `pnpm run dev` to update config values

### Account creation

1. Navigate to [Sign in using GCkey](http://localhost:8000/en/login-info)
2. Click the _Continue to GCKey and sign in_ button
3. Sign in or Sign up for an account
4. Start your account at the [Welcome to GC Digital Talent](http://localhost:8000/en/create-account) page
5. Copy the email address entered on the Welcome to GC Digital Talent page form for later
6. Run `php artisan tinker` in `/api` directory
7. Run the following code block in tinker to add `base_user`, `applicant`, `community_manager`, and `platform_admin` roles to the user previously created (replace *username@domain.tld* with email previously copied in step 5)

```
$user = User::where('email', 'username@domain.tld')->sole();
$user->addRoles(['base_user', 'applicant', 'community_manager', 'platform_admin']);
$user->roles()->get()->pluck('name');
```
