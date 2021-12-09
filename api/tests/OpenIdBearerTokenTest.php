<?php

use App\Services\OpenIdBearerTokenService;
use App\Services\Contracts\BearerTokenServiceInterface;
use Illuminate\Support\Facades\Route;

class OpenIdBearerTokenTest extends TestCase
{
    /**
     * @var BearerTokenServiceInterface
     */
    protected $service_provider;

    protected $tempConfigFile;
    protected $tempJwksFile;

    protected function setUp(): void
    {
        $this->tempJwksFile = tmpfile();
        if(!$this->tempJwksFile)
            throw new Exception('Failed to open temp file for config');

        fwrite($this->tempJwksFile, <<<RAWJSON
{
    "keys" : [ {
        "kty" : "RSA",
        "use" : "sig",
        "kid" : "keypair1-public.key",
        "x5c" : [ "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAySpVphgnK37UIQoR/S3AgHoj9Hv7JyGlEZYbfo5v48F780id6qEbU9SJYBC7R8QMSGoD7axOgNJSU+6t5GioRBsBTNVlbkkja9Q13ZFHJoYKBQmJWkCRncexVwC3wn+gW9zsGtRlN912b8GAUr4MKrHAD3Lswyfm0pZiTVUtF2QnSHECzI4iGP8falb/Verr681dlqdgwOVlGa4bFK7bMUYp2+JdioezJgEi+pU9Ibhx24R2KLm/PS+J79gZHLQ3gIOEXL3JFX027xuV8bw2FKFP5F9VlDnherxicwyRgt87Q+npftAw0hEjfeZvSq5Y71FHP6GWqeHQLbrLtKJ8S4MAHPzrCw342uX/c1/Aj73oSThEygNE7atFEokrtqsRNK0q/Op12pp5LPvYxuUdEXfALVNNdG6W3INjyT9LjmdESP74cYXxfFGwSHA6kJsA6Ggww6JMZ/wM50LUvs4Y60OCHDxMhfq2czSlbhc9ugQUJ5eFRYfwUQnXvHDV5IAcYHQ+jqqk6D/aoFOWvoCnjOtbUx1ous9T+ClaMEnUYU/4XhoRjitRG8veWF+x4opTQUBlyn/41rFJ3XX6P3I/nDK15yyZdQO9A1TuADlYIgw6h6mLQo+W5w0Su6rbR2AmBWoxAnWdWaGMJOBzIyJsnGM9BWRf2WWicrGLFyT9vrMCAwEAAQ==" ],
        "exp" : 2147483647,
        "alg" : "RS256"
    },
    {
        "kty" : "RSA",
        "use" : "sig",
        "kid" : "keypair2-public.key",
        "x5c" : [ "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxsHPaHvc+oPncNq5UAHYABjsdQQvmclHp8PaIBUlrb5YyGN8yYr9sUugc/v2p6b24lfhrb17JLKMeCUyH1/937OgwzaKjJDhqijTWLyxzCfXm2tFbw7TWuDHA00RPl3UiaXb6SdXEFlOddCK5HlG7Hff/1d8PBwuJ2d7DzbkA4pokGs35Z77fGVkfeUkBMsVp2w/jjHVUslRhx1l6K+RS0u2vZH0JjTKDu5mcf41e6sDUCpP8PhzlWR0GsLWq+nJAIcFOdi2bQezNou0GS5jraT3N3clgJRkuktMD5ulM8XFerJXAaWlb9v6FOwI5f425aH37Fe1HXDteREYXqrs9eVYe+TEyx25aegM5iEfHVrk6hugU6Od0lb+7P+OSvc6cn9FHONdF854xiMzrKmo7rtTqJLzw0zbqbEJojyeAtNKdgPAPfdDO6RouvPfXkdlIaBH5VHxfaEGvNj9cpsvKEhOKtdyQI3M5ZKXhIBz1f4XDc5Ef9TeQUd/c5FbdHmpQv2APTR+NOitaJK1Q26JQQyTBYKyUk2WCa60ht3mWI5K0n/z4pqcmri4lGW5uTejiybbQqs/rFKQt3lXwIrJIX7N3K0SMU77tG47KFRenaoH8FrukupintEIZSK8N46XZcSPunkJk5SjAFLpmXpf4feJ1eGhgVM1MCoOEuMBOUkCAwEAAQ==" ],
        "exp" : 2147483647,
        "alg" : "RS256"
    }]
    }
RAWJSON);

        $this->tempConfigFile = tmpfile();
        if(!$this->tempConfigFile)
            throw new Exception('Failed to open temp file for JWKS');

        fwrite($this->tempConfigFile, '{ '.
            '"issuer" : "http://test.com", '.
            '"jwks_uri" : "'.stream_get_meta_data($this->tempJwksFile)['uri'].'"'.
            '}');


        // generate keys and tokens for testing at https://jwt.io/#debugger-io
        // make sure you set algorithm to RS256

        $timeZone = 'UTC';
        $configUri = 'tests/openid-configuration.json';
        $this->service_provider = new OpenIdBearerTokenService($timeZone, $path = stream_get_meta_data($this->tempConfigFile)['uri']);

        parent::setUp();
    }

    protected function tearDown(): void{
        fclose($this->tempConfigFile);
        fclose($this->tempJwksFile);
    }

    /**
     * @test
     * A valid token is provided and validated.  The test checks that the right sub value is returned.
     */
    public function it_accepts_a_good_token_and_returns_the_right_sub()
    {
        $token = 'eyJraWQiOiJrZXlwYWlyMS1wdWJsaWMua2V5IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoyMTQ3NDgzNjQ3LCJpYXQiOjB9.JJFzkrJ7-2VHIoFVuOO-kP1hVK0hxZZeqWrxRHtknHUiiST3KOBO90WVEdfFbbuTkJoicFPtidOsFTNfuUAb-TIgoL5AUX5P3GnuM_IYMVJROzHZoSByQp72OMr97maHY71SwAIl4c6Ld18V8nGm_Eo9GRWRWpN8G0D0nhAgep0-RylezLHbin7trm_UI0g1E4K4S8QteELNfjzOpxKCz1qp1U-wqdNGawrY4wvUFWXPpvM0VtdXDAeJthF3W1dB_2kJFrLLQ_QSSqDOLoS_L8sgNgqfuzpBnzbUpJcUGLaIGfJMsHN5fximdR1PSLs5c3iLmNInZz7BuvwDN3usGqN_FkGSMeOdw6xC2-6zm6ZVF8PndHlL27q4k9YyLOtbiHzhm8vATl8hK5DPxdUKK4PMcZNmEw9AZM5VnTNfOD4vtccRY-XZp21ecIji3lpHpUTKTgHAF57_P52f8YvIuHZCIpJgCY985mXKK8sAtc98C_UxobONigarfH2w4nYmlNbYviZNiO587pjh8fv5ptTmogRxzY8EyAv4giCqI7ezF1OJfAqiWG7YcsY9I2c5Q60g5dlu6Qre54IxjpzoczgmFlJd7lKR-y3XU49yVu8kuQ_d_yAvzojybw5Y5xopIVGb0j0boiGjigP1Qqwp7DFoN6cAok59t7s4XZFuyEQ';
        /** analyze token at https://jwt.io/
        {
        "kid": "keypair1-public.key",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 2147483647,
        "iat": 0
        }
         */
        $claims = $this->service_provider->validateAndGetClaims($token);
        $this->assertEquals("1234567890", $claims->get('sub'));
    }
    /**
     * @test
     * An empty string is proved and should be rejected.
     */
    public function it_rejects_an_empty_token()
    {
        $this->expectException(Exception::class);
        $token = '';
        $this->service_provider->validateAndGetClaims($token);
    }
    /**
     * @test
     * An nonsense string is provided and should be rejected.
     */
    public function it_rejects_a_nonsense_token()
    {
        $this->expectException(Exception::class);
        $token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        $this->service_provider->validateAndGetClaims($token);
    }
    /**
     * @test
     * A token is provided but has the wrong issuer and should be rejected.
     */
    public function it_rejects_an_incorrect_issuer()
    {
        $this->expectException(Exception::class);
        $token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3Jvbmdkb21haW4uY29tIiwic3ViIjoiMTIzNDU2Nzg5MCIsImlhdCI6MCwiZXhwIjoyMTQ3NDgzNjQ3fQ.rkH4K-JgFtICMib4qAbYpUjliHCuOPzyPMvpKXT5Ia5U_X-WElikYKysp9kjp44UUxr1kGnKCnipdYSHyTGFh-faEW26xNwQOfGnFqt3x4bcJEy5pd9-D9I9LWt8BgvMeiibVbGeMyvaIWOirTVMfDXXuu3q4LMddq7yaZAkMyZjYOh3PolffDHS05OxVvkdGPEbO_yQmFRr1SVvMz_dL25gN4Eyx-HCX4zPJSVfXeRJXevJB24jUX5mDy9s0nLzo_lWr6uUFL9hV2MvfCNvxcH5i4QEmRhHT_xGZaxMyOHYCf9DT6MJhwuxMWvB92nHYww4l28On4JPtGglWn1uuw';
        /** analyze token at https://jwt.io/
         * {
         *   "iss": "http://wrongdomain.com",
         *   "sub": "1234567890",
         *   "iat": 0,
         *   "exp": 2147483647
         * }
         */
        $this->service_provider->validateAndGetClaims($token);
    }
    /**
     * @test
     * A token is provided but has expired and should be rejected.
     */
    public function it_rejects_an_expired_token()
    {
        $this->expectException(Exception::class);
        $token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjowLCJleHAiOjF9.COyUre0XoDjbC_vG59uJKFsXYq6pnN3snwBXRS96Ux9UxmEC6zcAKP504E0EbIYFQC8dZk5xoh90szPKThloOJD5drw3QOTFwV0xapj1jLxTI7mVI-fWtk4X16zgV4EMM9EeLKeHl-sD6hVkJ0taxbouDB1o_vmOPUa0cfg_6n0LjLbdtURTtnCsQOzBWCNqf7Y47Y-O6DyxQcSv9lcGYFhDIssWyZbwN4rWw7SDPQ7HZI-8iWWY_P-cLQCg4hV6B4NDrCXRzRJWKNwa5Oh-3pgr3CJQIFAplO4g-k40-3se_G22UXaCulwWuxx_vAI9ieronWOKHoNdGBNI-M-l3w';
        /** analyze token at https://jwt.io/
         * {
         *   "iss": "http://test.com",
         *   "sub": "1234567890",
         *   "iat": 0,
         *   "exp": 1
         * }
         */
        $this->service_provider->validateAndGetClaims($token);
    }
    /**
     * @test
     * A token is provided but the issuing datetime is in the futured and shoudl be rejected.
     */
    public function it_rejects_a_future_token()
    {
        $this->expectException(Exception::class);
        $token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoyMTQ3NDgzNjQ2LCJleHAiOjIxNDc0ODM2NDd9.NrhvVts8RkUaO1pUEH7Cq6DQBnNSHeb5oPVri4KeQ4_JovEWNylu1_hHX3-aSVkC0q9FwT0Dh8i3Y8xtvllOMIrLknIGZWsLX5bR4F0WnJgbs88LC774ad0VbbybH9PawK8LBWehLfp-QfFnf5chcKh_nI9cZ68BjLPJi_-D2UEWb1an5hO-Iv85oBt4RfpNEqU48jkFBKGYhi1L8nrXZsqEMKODqTvfS4m3aggiTL2b2kLA1H1YwGVu524cPlxGnpFMhN2abRcxrqKg7p6ZDovinq1xSStVrmskP-I1LiYwmzM8MOIW13tOLpa8i4i_7CnMSKoJjnhLIrRJP3WhEw';
        /** analyze token at https://jwt.io/
         * {
         *   "iss": "http://test.com",
         *   "sub": "1234567890",
         *   "iat": 2147483646,
         *   "exp": 2147483647
         * }
         */
        $this->service_provider->validateAndGetClaims($token);
    }
    /**
     * @test
     * This is a good and valid token but was not signed by the expected key so it should be rejected
     */
    public function it_rejects_a_token_signed_with_a_different_key()
    {
        $this->expectException(Exception::class);
        $token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjowLCJleHAiOjIxNDc0ODM2NDd9.lSbnINudocJHY_ICgawda6JZuYjtOLKx-3J4LfnOe50SB2gZqZPpYNDYQXn4IkfJN8UN6zbGZI502MaS5dgdmTAc35tJe8UclwsVPbHr9m2VxFAD9zZvsya5dq30IOXyt0yy1clnk-00dy-NcotADSGCSVUIEEP4fEGIxX98_sba4lxV00aOwo7m97F4fR9qLOd5sJ7ia5eO3ftcRzvea_MzWrLmDJ3RJLrc4I3FQlbcXFvLep1f3y-pcRobEDmSZVnFtjjUYQIAMtwsDlhgYqWwM-NswFTbd9G1PD2p9eaVrhZ7vuk7IKA6e0jyWyMKl7pncOc9VO5xtNu1a7O8azUvJrertFXn5GMGF53q_vpRTxnO-Oyzbh6Rzxq1kpMUqLnqaANqF0EeQ_KUB0jTR3F31cdNF-iLuwoBMQTJlFxJ7ir8ooYC_we1pAxfn9A2V2o8XJAN7vTNJkNicoUu_EZNLTH0uaBxMTElArVMCqNmPXyqcTzk6GM2IckMmGpcq0W7EZ__j4W2FxYqpnFp80K4dvHHpNPK4n00RPgwHM6quAyzYTA0WvgNTjJxJz5YBgoujKPSvDrj0GE17S-qEmFx-WwW1P-_WlS1oq_fyYy2evV-HcPs6euUO8pSp-lstVIyrsEZgxuqnsqz5eDg_3l2bgKIS8UXIhZEAaj-VS8';
        /** analyze token at https://jwt.io/
         * {
         *   "iss": "http://test.com",    -- arbitrary issuer
         *   "sub": "1234567890",         -- arbitrary subscriber string
         *   "iat": 0,                    -- issued at beginning of time
         *   "exp": 2147483647            -- expires at end of time
         * }
         * different key:
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAySpVphgnK37UIQoR/S3A
gHoj9Hv7JyGlEZYbfo5v48F780id6qEbU9SJYBC7R8QMSGoD7axOgNJSU+6t5Gio
RBsBTNVlbkkja9Q13ZFHJoYKBQmJWkCRncexVwC3wn+gW9zsGtRlN912b8GAUr4M
KrHAD3Lswyfm0pZiTVUtF2QnSHECzI4iGP8falb/Verr681dlqdgwOVlGa4bFK7b
MUYp2+JdioezJgEi+pU9Ibhx24R2KLm/PS+J79gZHLQ3gIOEXL3JFX027xuV8bw2
FKFP5F9VlDnherxicwyRgt87Q+npftAw0hEjfeZvSq5Y71FHP6GWqeHQLbrLtKJ8
S4MAHPzrCw342uX/c1/Aj73oSThEygNE7atFEokrtqsRNK0q/Op12pp5LPvYxuUd
EXfALVNNdG6W3INjyT9LjmdESP74cYXxfFGwSHA6kJsA6Ggww6JMZ/wM50LUvs4Y
60OCHDxMhfq2czSlbhc9ugQUJ5eFRYfwUQnXvHDV5IAcYHQ+jqqk6D/aoFOWvoCn
jOtbUx1ous9T+ClaMEnUYU/4XhoRjitRG8veWF+x4opTQUBlyn/41rFJ3XX6P3I/
nDK15yyZdQO9A1TuADlYIgw6h6mLQo+W5w0Su6rbR2AmBWoxAnWdWaGMJOBzIyJs
nGM9BWRf2WWicrGLFyT9vrMCAwEAAQ==
-----END PUBLIC KEY-----
-----BEGIN PRIVATE KEY-----
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
eB22Ko6wvYOvdr7GBLU5zWa+swrg4g==
-----END PRIVATE KEY-----
         */
        $this->service_provider->validateAndGetClaims($token);
    }
}
