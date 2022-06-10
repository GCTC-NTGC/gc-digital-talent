<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\UnencryptedToken;
use Illuminate\Support\Facades\Log;
use \App\Services\OpenIdConfigurationService;

class AuthController extends Controller
{
    /**
     * The Open ID config instance.
     *
     * @var \App\Services\OpenIdConfigurationService
     */
    protected $openIdConfig;

    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\OpenIdConfigurationService  $openIdConfig
     * @return void
     */
    public function __construct(OpenIdConfigurationService $openIdConfig)
    {
        $this->openIdConfig = $openIdConfig;
    }

    public function login(Request $request)
    {
        $state = Str::random(40);
        $nonce = Str::random(40);
        $request->session()->put('state', $state);
        $request->session()->put('nonce', $nonce);

        $request->session()->put(
            'from',
            $request->input('from')
        );

        $requestedLocale = $request->input('locale');
        if(strcasecmp($requestedLocale, 'en') == 0)
            $ui_locales = 'en-CA en';
        else if(strcasecmp($requestedLocale, 'fr') == 0)
            $ui_locales = 'fr-CA fr';
        else
            $ui_locales = $requestedLocale;

        $scope = config('oauth.client_id').' openid offline_access';

        $params = [
            'client_id' => config('oauth.client_id'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'response_type' => 'code',
            'scope' => $scope,
            'state' => $state,
            'nonce' => $nonce,
            //'acr_values' => 'gckey',
            //'ui_locales' => $ui_locales,
        ];

        $url = $this->openIdConfig->getFieldValue('authorization_endpoint');
        foreach($params as $key => $value) {
            $url = $this->addQueryParameter($url, $key.'='.$value);
        }

        return redirect($url);
    }

    public function authCallback(Request $request)
    {
        //pull the original nonce and state from  beginning to compare with returned values
        $state = $request->session()->pull('state');
        $nonce = $request->session()->pull('nonce');

        throw_unless(
            strlen($state) > 0 && $state === $request->state,
            new InvalidArgumentException("Invalid session state")
        );

        $response = Http::asForm()->post($this->openIdConfig->getFieldValue('token_endpoint'), [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'code' => $request->code,
        ]);

        // decode id_token stage
        // pull token out of the response as json -> lcobucci parser, no key verification is being done here however
        $idToken = $response->json("id_token");

        $config = Configuration::forUnsecuredSigner();
        assert($config instanceof Configuration);
        $token = $config->parser()->parse($idToken);
        assert($token instanceof UnencryptedToken);

        //grab the tokenNonce out of the unencrypted thing and compare to original nonce, and throw_unless if mismatch
        $tokenNonce = $token->claims()->get('nonce');
        throw_unless(
            strlen($tokenNonce) > 0 && $tokenNonce === $nonce,
            new InvalidArgumentException("Invalid session nonce")
        );

        $query = http_build_query($response->json());

        $from = $request->session()->pull('from');

        if($from != filter_var($from, FILTER_SANITIZE_URL))
            $from = null; // Contains unsanitary characters. Throw it away.
        if(substr($from, 0, 1) != '/')
            $from = null; // Does not start with / so it's not a relative url. Don't want an open redirect vulnerability. Throw it away.

        $navigateToUri = strlen($from) > 0 ? config('app.url').$from : config('oauth.post_login_redirect');
        return redirect($navigateToUri . '?' . $query);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->query('refresh_token');
        $response = Http::asForm()
            ->post($this->openIdConfig->getFieldValue('token_endpoint'), [
                    'grant_type' => 'refresh_token',
                    'client_id' => config('oauth.client_id'),
                    'client_secret' => config('oauth.client_secret'),
                    'refresh_token' => $refreshToken,
                ]);
        return response($response);
    }

    private function addQueryParameter($url, $query) {
        $parsedUrl = parse_url($url);
        $separator = ($parsedUrl['query'] == NULL) ? '?' : '&';
        $url .= $separator . $query;
        return $url;
    }
}
