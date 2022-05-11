# Laravel Passport Config

0. Run `composer install` and `npm install` to install dependencies.

1. As with any Laravel application, you should run start by running `php artisan key:generate`.

2. The Passport migrations will create the tables your application needs to store OAuth2 clients and access tokens:
`php artisan migrate`

3. This command will create the encryption keys needed to generate secure access tokens: `php artisan passport:keys`. They will be created in the storage folder. This command will also create a file called `.rnd`, which can be ignored. (Alternatively, you can define these keys as [environment variables](https://laravel.com/docs/8.x/passport#loading-keys-from-the-environment).)

4. In order to hash client secrets, the [Personal Access Client](https://laravel.com/docs/8.x/passport#creating-a-personal-access-client) Id and secret must be saved as environment variables. You can generate the id and secret with the following command (it needs a database connection) but you must save them as env variables manually: `php artisan passport:client --personal`

5. Every client which will use this auth server needs its own id and secret. You can generate a new client by running `php artisan passport:client`.

Note that steps 2, 4 and 5 require a database connection. If you're running this using the local Docker setup, you may need to run the php commands within the container.

For more details about using or configuring Laravel Passport, visit the [documentation](https://laravel.com/docs/8.x/passport).

## Using Authentication Service

This authentication service uses [Laravel Passport](https://laravel.com/docs/8.x/passport) to implement the OAuth 2.0 spec. A good explanation of OAuth can be found [here](https://aaronparecki.com/oauth-2-simplified/).

GC Talent is using OAuth to allow the separation of our authentication service and our API. In [OAuth terminology](https://aaronparecki.com/oauth-2-simplified/#roles), our /admin project is the "Client", our /auth project is the "Authorization Server", and the /api project is the "Resource Server".

The process begins by having the Client visit a particular url of the Authorization Server. This url must include query parameters which specify the client making the authorization request, and some other details. [This website](https://oauthdebugger.com/) can help understand how to build the url. Use http://localhost:8000/oauth/authorize as the Authorize URI. You will need to have already created a client with an id, following the configuration steps above. You should use the _code_ response type and the _query_ response mode. You must also use the _openid_ scope, the only scope currently recognized by the auth server. Another query parameter specifies a _redirect_uri_, which is a url of the Client.

If you visit the resulting url, the Authorization Server will redirect you to a login page (note that if you must register a new user at this point, you may have to restart the authorization process later). If you successfully log in, the Authorization Server will ask the user if they want to give the Client permission to access their identity. As long as they consent, they will then be redirected to the Client's _redirect_uri_.

Since our Client does have a web server (despite relying on SPA like React code) we can use the [Authorization Code flow](https://aaronparecki.com/oauth-2-simplified/#web-server-apps), one of several OAuth 2.0 flows. In this flow, the redirect to the Client includes something called the __Authorization Code__ in a query parameter. At this point, instead of returning control directly to the user, the Client server must make a POST request [back to the Auth service](https://laravel.com/docs/8.x/passport#requesting-tokens-converting-authorization-codes-to-access-tokens) at http://localhost:8000/oauth/token, with more query parameters like their _client_secret_ and another redirect uri, to trade the __Authorization Code__ for an __Access Token__.

Finally, the __Access Token__ can be used by the client to access the API service. The token should be included with every request in an [Authorization Bearer header](https://laravel.com/docs/8.x/passport#passing-the-access-token).

_TODO: Notes on how the API uses the token's JWT format and the Auth Server's public key to ensure the token is legit._

## OpenID Connect (OIDC) and OAuth 2.0

For OIDC, the initial request includes a scope of openid and in the final exchange, the Client receives both an Access Token and an ID Token. [This article](https://developer.okta.com/blog/2019/10/21/illustrated-guide-to-oauth-and-oidc) provides a deeper explanation on both OAuth 2.0 and OIDC.

## Why is this so complicated?

The reason we're doing this whole runaround of redirects and exchanging tokens is that it means the Client, the API, and Authentication (ie registration, login, passwords and 2FA) don't have to be on the same server. This will allow us this Auth service with a government single-sign-on solution in the future, and it will allow us to open up our API to other clients not developed by our own team.
