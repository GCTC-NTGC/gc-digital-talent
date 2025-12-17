<?php

namespace Tests\Unit;

use App\Services\OpenIdBearerTokenService;
use DateTimeImmutable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Psr\Clock\ClockInterface;
use Tests\TestCase;

class OpenIdBearerTokenTest extends TestCase
{
    /**
     * @var OpenIdBearerTokenService
     */
    protected $service_provider;

    protected \DateInterval $allowableClockSkew;

    const fakeRootUrl = 'http://test.com';

    const fakeConfigUrl = self::fakeRootUrl.'/config';

    const fakeJwksUrl = self::fakeRootUrl.'/jwks';

    protected bool $fakeIntrospectionIsActive;

    protected DateTimeImmutable $fakeIntrospectionExpiry;

    protected function setUp(): void
    {
        parent::setUp(); // initializes Http facade

        $fakeIntrospectionUrl = self::fakeRootUrl.'/introspection';

        Http::fake([
            self::fakeConfigUrl => Http::response('{ '.
                '"issuer" : "'.self::fakeRootUrl.'", '.
                '"jwks_uri" : "'.self::fakeJwksUrl.'",'.
                '"introspection_endpoint" : "'.$fakeIntrospectionUrl.'"'.
                '}'),
            self::fakeJwksUrl => Http::response(file_get_contents('tests/Unit/resources/jwks.json')),
            $fakeIntrospectionUrl => function () {
                return Http::response(json_encode([
                    'active' => $this->fakeIntrospectionIsActive,
                    'exp' => $this->fakeIntrospectionExpiry->getTimestamp(),
                ]));
            },
        ]);

        // generate keys and tokens for testing at https://jwt.io/#debugger-io
        // make sure you set algorithm to RS256

        Carbon::setTestNow('2020-01-01 00:02:00');
        $this->allowableClockSkew = \DateInterval::createFromDateString('4 minutes');
        $this->service_provider = new OpenIdBearerTokenService(
            self::fakeConfigUrl,
            $this->app->make(ClockInterface::class),
            $this->allowableClockSkew
        );
    }

    protected function setIntrospectionResponse(bool $isActive, ?DateTimeImmutable $expiry = null)
    {
        if (is_null($expiry)) {
            // calculate an expiry time stamp
            if ($isActive) {
                $expiry = Carbon::now()->add('minutes', 1)->toDateTimeImmutable();
            } else {
                $expiry = Carbon::now()->sub('minutes', 1)->toDateTimeImmutable();
            }
        }

        $this->fakeIntrospectionIsActive = $isActive;
        $this->fakeIntrospectionExpiry = $expiry;
    }

    /**
     * A valid token is provided and validated.  The test checks that the right sub value is returned.
     */
    public function testAcceptsGoodTokenAndReturnsCorrectSub()
    {
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoyMTQ3NDgzNjQ3LCJpYXQiOjB9.qiOmlGVi-7K0B8eeZNYY21yZnXDn5pZWFMSLM6UH2uHUQ8mdcN0Ocd36Sq1vKvWeOgTvEm_MCl5GGCert16huUoEiILnlmf9F4i7L7wa1HIgPZnXKxKFbShbUUFMSn-6WxEQxF5g-s6cr77Lu6H_y2_osD39MFcpxTy5k5zJE8EXwQ2FGxmYhW4_qpNF3WQcMge5dfhaPaLpxH1lSrYHkCqnfGJkcTMRg3TPkQe1KWV4VUf2uGl06FleWCXuPgO__LSWeA2YHsyCV7tMPVDlOIOtiyZA1Pk4G_p2ur8a403NyIjdcXOscwIHd55vw--GOdMGSurLMS_rHfz0FD6bRSzW_6AWfBa4KQJVkoM_U6aUZ5yBEbzbsNh2u1H-OyEVBgu4R5XoyXfcn8-Z8nq_ciER8UyvVXTj9WnU--ELEZ_0Qxn4ovKqjXdL7eGwwQ5YercEh-iGiaHikEi2pD1YpfbpXE_uS3Wl2Acd8f_4sIzyQfbBfGoqIZb_cPKIm-gRhJlJn-dRdO_Hzy0rCkDngbSEg_VAeQQv-JAvOlQimI73scyWyLGLzuyOZV33Sy0NAsdOJ0xiM0C5HT_-Wc-ZFHW3uYWzixu60c0yRiJ2vV0-o-VTvpkALYPmy5n8SXSKKP59psvGzSydiX4dq5bk2XGq8wTsUGBOObTVZEN_j9E';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(true);
        $claims = $this->service_provider->validateAndGetClaims($token);
        $this->assertEquals('1234567890', $claims->get('sub'));
    }

    /**
     * An empty string is proved and should be rejected.
     */
    public function testRejectsEmptyToken()
    {
        $this->expectException(\Exception::class);
        $token = '';
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * An nonsense string is provided and should be rejected.
     */
    public function testRejectsNonsenseToken()
    {
        $this->expectException(\Exception::class);
        $token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but has the wrong issuer and should be rejected.
     */
    public function testRejectsIncorrectIssuer()
    {
        $this->expectException(\Exception::class);
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3dyb25nZG9tYWluLmNvbSIsImV4cCI6MjE0NzQ4MzY0NywiaWF0IjowfQ.xtr4Xolvxryi6_vMLquynGmbi0v925e6wC5hPUYgUXxVXaiZ8IoMHW5hR7sG916ZrsE52IRZXKWXv8sbebUdiavJVav94nyRJTtcp24FoefB_yLck930xZgHLSl5WmqMf7jhy8OBhBIgVCNQY9kj2BzAgrqJ0RCY-9F95unwSPfQHm9rryILY2DlgduReoDIpO1u1E-Lwyw3rVt-hKChsyP1tcc1GyVXNFPfd3YyeAO6Mez6yV8mcTAnsHdrYSrp8XHTbEb5tmF3QQQR-WjftmAMFjq1UA0e70WjfKh0ZNzHMCJt2W0ElWIL8pkliop68Y-STNqZnZStemq0PaRfX1jhfek-To6J1UfuAfiiYjaJoCoOxECdY_xb0UCyLLcG-g2roAeqKQgrEp7PCbjdXE8Xe_e4Yc4gNWDidOoV0vqrxx05h1KCmIy8u1W8xbdXTOVH39yIt7_JKWM_g8ySO5x0fQHdIqgNgW5CWPoYel45k23bnfqq7bOCIULj3SeKMrrP-WBAWaJs0Z6noKql08HcQYOFoqaYPj8wFF1T4IzVyYbcOxWY_L9pAzxU19WOa01Me2oDA9SCBKGszZMgYVEkayL40J0MB5qpMYjR9x-Dd1xifyr9zlNEy7-jlOyM6BopZrovWbIEI1w1XqqCmXQoXfxhD3ZYrSbX5k6l-bc';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://wrongdomain.com",
        "exp": 2147483647,
        "iat": 0
        }
         */
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but has expired and should be rejected.
     */
    public function testRejectsExpiredToken()
    {
        $this->expectException(\Exception::class);
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoxLCJpYXQiOjB9.hfY-0wyAaBL9GDysfc33VMou1pEuGbbwL6oSKzjLdBUtZ5-x--ROaFgUf4NbnSYR7erSggsGMq9Z15gtZVRnYNu1n2QiLYq3mhh83peBH0zdhAB7K_GO_Tpe6dswMGg0esgcp4odH1mlxHYb2RzHkAbYbrYeCYvG537HcoTXFhfltFHpZq7nVMxxbLC0QnSkDSO0vUfyYXiFBe-s5Jxb3UMuStpdPpvrl3OtCh7i-P91BJl5RFN1h7Xd6je1qwcYhQi6aKrPex9sXbdQ3ywzYmxCSHMmIGtYGpbNf_A9WdDKe2SMUW9Q6XWrWCuvTM-SEGUsV1ezrncn21CZfPUREQ_wl7wEdYo2R2W6Ybhgw4Wu0hJEsRxPfP-oNAV4HsVzOh2XRVVYrJ-Y0v_ij6JprDovddXNHFhB4ITeLbB0lSN1pA2qFvPySvPwfNcMNCK5cNY0WVfJmPjgrlxSPCMOIjlCJIaIkPj2QxWbdsMeiASXCKPvrmCiTsrbzxydPprrL6pbdNE_ILPsyf0DpCitMvKtGBmtgr3hv-XP3pjOm2To_bspp-R59Z2pYA_Rav0HdqCPpTC6MZBsf-oF3CSzYviMAxFDq20DUPflT9mzcLGmPtmCVshjfQJ1i9iH55S7TWAhDGT50rVGUje0ZSFVDU1nFYThcVZqb787BN417x8';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 1,
        "iat": 0
        }
         */
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but the issuing datetime is in the future and should be rejected.
     */
    public function testRejectsFutureToken()
    {
        $this->expectException(\Exception::class);
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoyMTQ3NDgzNjQ3LCJpYXQiOjIxNDc0ODM2NDZ9.NGbN9gRz_duLXrziyFc3tg_8YtebqWUR0iuoiUElCi3KNOlJjvwPERUWbhYfEgx-FmN7u-FfGjgZoIsK9i745IxHvgunaP3xbZlq-M2FGRd2gMNMMX7n1hnrtuNR43ULmAMleU5ps8l4ey4-FjJCBHoRK0tG_BLkzdbbh-eqU16StIDwzfeJblMUFk78j7gKHS0g15udkNwXm2YawxlqH8ihCf3Ty0E3Jedpmo83L67EI5VKNy2ab7lauEk1xvJUoteUK0ugwpYMPm54LPXYUeWPXI2JpzdlNNZkPdlAhaM3nVPHrYBAPWdWPR83E9R4svc5anva73TtOnDH_8blb3dFkHKTdANbRLWv8kkFL-QogY4sJazzn_v61ZgjS5Q7tqXrQgim6_7871-bbdDO6zYGIQnDWecCXqMJLrXjkkRhs8-euEsXmZm5LaSIEcHSb05XU2rgb6LwFeKdQE7DuZcVWJ0gEFI_13ciOOe1ltFWbUhSppHSfiQ320H3lldlIHuh_gDLWTjyWcCffveV_I3fUF2E0z83926hvwycPH3qcRVyOz5lr_o6SaH8ogmFnhNea-qIgQX-Uo3MZVeiVHKmthiod-p_lF8xMLAao--z_cfPxSe7YC4yBehfRQW3Hnzo13D9M9avHUtNxAEfy89naaTa6LO8GK8EZlHndtU';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 2147483647,
        "iat": 2147483646
        }
         */
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * This is a good and valid token but was not signed by the expected key so it should be rejected
     */
    public function testRejectsTokenSignedWithDifferentKey()
    {
        $this->expectException(\Exception::class);
        // this token actually signed with key2
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoyMTQ3NDgzNjQ3LCJpYXQiOjB9.o-gz2gQSJ7frAfJq6H9DYWqxPmeptsbnAKUJpg7V5OdJVV3cmN5S4Ask0B9RoutlFix8jjBX0tYksyCxJ97Rz2wcFZNh_FpDyE9oQ3xgApfnHzerIiyfpxYWIzg-LWixuObha2aLN15CwxfBoFACbZ0SN_PeXkw9NWGmy_FUAmoLbf6K1NYmZY85eqGvyOifXf8VFXMFj0Wd0XlH1fR_dXiUn7oud_9FDIrTfr9eWXRriRleQTGcnkTns7VnddXp6qo6NQchcIvejg1L4Zukpe_YZ37T2fQUDR6ctRGeZj1qmNKHTiUUfiiMoHAfBz0Hx9EW_BTaasUWt0kbv8Xym26bwg-UXj4v6GA2YcwimPHi4rhs6bKOfgNiNqllqkF7Xf-Q86GDicaiV_kuP8JQa68svv4NdUCyfY9AVsV19PjoPClQdKzqSZtl1Ng9i6CujHNzCsqZDHZvvfhHHFlVovLJZjKEX5hQas6SdBV5pjPkJCC-Kwiin9NJb4l-nVIBkRvt5DRbXNF2xQDloQPPhSrJcT6TF2kaMbKOxMbXJ9aOnMLraAoXaImWlYc3JTiGotvovmtv5gPjs2Q_9-AuuQIkhluy2NF-pXuKMtcZB0qopsC8pG_6JhsE9NE8sgWxDeXOW6FC5tY7hix3bocy5oDN3kxUZ-dLhtR6d7eBulc';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
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
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but has expired within allowable clock skew and should be accepted.
     */
    public function testAcceptsExpiredTokenWithinAllowableSkew()
    {
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoxNTc3ODM2ODYwLCJpYXQiOjB9.zI4EHjfWyZP3G8DFRAMJXF9mZrA65RizQMrnQGVuKFYm0cwMusBToaH5k4feB0b2WPfBkl3-gHOJ5qKoNcR50RI_t5LEZbBVZrGhCDfpCDVlO5ZnwABhQo48NUi2ZbMb1ZoDTa_802hifvpjhOtEE0V9_zCsDZ1pcA9G4rsqEv5T3N35JV_xwgD_PqToZrxCMNuJOG5k8suoIKazzN5eJm3adKi7UsOqh-DJTni7-z88A95UycS0ONw5APFYU-IE3kL5UL1K6OwvXEgpD0md06qB3GUmkkjXeGumDefokT8RouAIbX8p37cfvxeuctJ1WtKZJ3IrJx0E4y-15JCLaPQ3tmv4XQ7lfHf9Yblith7Sw4T4upO7wtynogg2Y_Oget7zLksvaza77SRkXLf8Si3lGJ9ydqSlkLKqo8aX5nQJAkUnRY72eIz5jEEdBBrkpTQdQRG4g2-R9xXd9rGCscdAt2S3COJEFhO2FrgwUiD0piHah-PlMVN5fw3wr2ISN9OYfd5_e15UxLgo0Qw99_mKaakXBf20umTkk2TGi8YmMZLvbOS6yI7eS1wo3rFPzdTOPT7WoW6iPl_kW0FdGZYQQb1GxI2RrjFl6Ud4axKqJbtv1dV9ml1Z9PPawBcIP2B702uLwc9RZrX8b3S3Cnq72-7iCWJVvET9IQr1ess';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 1577836860, //2020-01-01 00:01:00
        "iat": 0
        }
         */
        $this->setIntrospectionResponse(true);
        $claims = $this->service_provider->validateAndGetClaims($token);  // will throw an exception for rejected tokens

        // checks that the test was properly set up
        $this->assertTrue(Carbon::now() > $claims->get('exp'), 'test value for now was not after strict expiry date');
        $this->assertTrue(Carbon::now() < $claims->get('exp')->add($this->allowableClockSkew), 'test value for now was not within the expiry date plus allowed skew');
    }

    /**
     * A valid token is provided and validated.  The test checks that the right sub value is returned.
     */
    public function testThatIntrospectionCanRejectAValidToken()
    {
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoyMTQ3NDgzNjQ3LCJpYXQiOjB9.qiOmlGVi-7K0B8eeZNYY21yZnXDn5pZWFMSLM6UH2uHUQ8mdcN0Ocd36Sq1vKvWeOgTvEm_MCl5GGCert16huUoEiILnlmf9F4i7L7wa1HIgPZnXKxKFbShbUUFMSn-6WxEQxF5g-s6cr77Lu6H_y2_osD39MFcpxTy5k5zJE8EXwQ2FGxmYhW4_qpNF3WQcMge5dfhaPaLpxH1lSrYHkCqnfGJkcTMRg3TPkQe1KWV4VUf2uGl06FleWCXuPgO__LSWeA2YHsyCV7tMPVDlOIOtiyZA1Pk4G_p2ur8a403NyIjdcXOscwIHd55vw--GOdMGSurLMS_rHfz0FD6bRSzW_6AWfBa4KQJVkoM_U6aUZ5yBEbzbsNh2u1H-OyEVBgu4R5XoyXfcn8-Z8nq_ciER8UyvVXTj9WnU--ELEZ_0Qxn4ovKqjXdL7eGwwQ5YercEh-iGiaHikEi2pD1YpfbpXE_uS3Wl2Acd8f_4sIzyQfbBfGoqIZb_cPKIm-gRhJlJn-dRdO_Hzy0rCkDngbSEg_VAeQQv-JAvOlQimI73scyWyLGLzuyOZV33Sy0NAsdOJ0xiM0C5HT_-Wc-ZFHW3uYWzixu60c0yRiJ2vV0-o-VTvpkALYPmy5n8SXSKKP59psvGzSydiX4dq5bk2XGq8wTsUGBOObTVZEN_j9E';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(false);
        $this->expectException(\Exception::class);
        $claims = $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * If a second introspection call is made in quick succession, the second response should be a cached one.
     */
    public function testThatASecondQuickIntrospectionRequestIsCached()
    {
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoyMTQ3NDgzNjQ3LCJpYXQiOjB9.qiOmlGVi-7K0B8eeZNYY21yZnXDn5pZWFMSLM6UH2uHUQ8mdcN0Ocd36Sq1vKvWeOgTvEm_MCl5GGCert16huUoEiILnlmf9F4i7L7wa1HIgPZnXKxKFbShbUUFMSn-6WxEQxF5g-s6cr77Lu6H_y2_osD39MFcpxTy5k5zJE8EXwQ2FGxmYhW4_qpNF3WQcMge5dfhaPaLpxH1lSrYHkCqnfGJkcTMRg3TPkQe1KWV4VUf2uGl06FleWCXuPgO__LSWeA2YHsyCV7tMPVDlOIOtiyZA1Pk4G_p2ur8a403NyIjdcXOscwIHd55vw--GOdMGSurLMS_rHfz0FD6bRSzW_6AWfBa4KQJVkoM_U6aUZ5yBEbzbsNh2u1H-OyEVBgu4R5XoyXfcn8-Z8nq_ciER8UyvVXTj9WnU--ELEZ_0Qxn4ovKqjXdL7eGwwQ5YercEh-iGiaHikEi2pD1YpfbpXE_uS3Wl2Acd8f_4sIzyQfbBfGoqIZb_cPKIm-gRhJlJn-dRdO_Hzy0rCkDngbSEg_VAeQQv-JAvOlQimI73scyWyLGLzuyOZV33Sy0NAsdOJ0xiM0C5HT_-Wc-ZFHW3uYWzixu60c0yRiJ2vV0-o-VTvpkALYPmy5n8SXSKKP59psvGzSydiX4dq5bk2XGq8wTsUGBOObTVZEN_j9E';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(true);

        Http::assertSentCount(0);
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(3); // calls config, jwks, and introspection

        $this->travel(1)->second();
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(3); // hasn't changed, used cached response
    }

    /**
     * If a second introspection call is made much later, the second response should not be a cached one.
     */
    public function testThatASecondLongIntrospectionRequestIsNotCached()
    {
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoyMTQ3NDgzNjQ3LCJpYXQiOjB9.qiOmlGVi-7K0B8eeZNYY21yZnXDn5pZWFMSLM6UH2uHUQ8mdcN0Ocd36Sq1vKvWeOgTvEm_MCl5GGCert16huUoEiILnlmf9F4i7L7wa1HIgPZnXKxKFbShbUUFMSn-6WxEQxF5g-s6cr77Lu6H_y2_osD39MFcpxTy5k5zJE8EXwQ2FGxmYhW4_qpNF3WQcMge5dfhaPaLpxH1lSrYHkCqnfGJkcTMRg3TPkQe1KWV4VUf2uGl06FleWCXuPgO__LSWeA2YHsyCV7tMPVDlOIOtiyZA1Pk4G_p2ur8a403NyIjdcXOscwIHd55vw--GOdMGSurLMS_rHfz0FD6bRSzW_6AWfBa4KQJVkoM_U6aUZ5yBEbzbsNh2u1H-OyEVBgu4R5XoyXfcn8-Z8nq_ciER8UyvVXTj9WnU--ELEZ_0Qxn4ovKqjXdL7eGwwQ5YercEh-iGiaHikEi2pD1YpfbpXE_uS3Wl2Acd8f_4sIzyQfbBfGoqIZb_cPKIm-gRhJlJn-dRdO_Hzy0rCkDngbSEg_VAeQQv-JAvOlQimI73scyWyLGLzuyOZV33Sy0NAsdOJ0xiM0C5HT_-Wc-ZFHW3uYWzixu60c0yRiJ2vV0-o-VTvpkALYPmy5n8SXSKKP59psvGzSydiX4dq5bk2XGq8wTsUGBOObTVZEN_j9E';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(true);

        Http::assertSentCount(0);
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(3); // calls config, jwks, and introspection

        // advance the clock by 30 seconds
        $this->travel(30)->seconds();
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(4); // made an extra call since it's not cached anymore
    }

    /**
     * If a second introspection call is made in quick succession, but the token is expired, the second response should not be a cached one.
     */
    public function testThatASecondQuickIntrospectionRequestIsNotCachedWhenExpired()
    {
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cDovL3Rlc3QuY29tIiwiZXhwIjoxNTc3ODM2ODA1LCJpYXQiOjB9.G_gs9jaBUUiew520AZMmthTb-Ykj75BoB2AL-Qh7_wfNjZCTeS89jciPLp_Uh1CQJSK64yW3IyVd8XqZjSSVOARlZox5LlcXdHwdkqAyGa2_iiMOdk8E_ILX0gKWn1KaJyuuAMVnIocMMR8NN3T-m5NT8aYBXUEYF9XRaXcQL1ZfdE_E2JO-6pPZW55SEytQwRpi_mshs-EPolyxenWrNRRCP9xxUiO_FJ8wN0zaeheeCWo2t6z6TGT9VVEqojpfM-N6dGkrZyyFYpoxwksSeGp4clIBDb4aN7tysz0oXxZuNbF7Ex9wv9oRslb9MaMTc1FR5hDZNRiCVlCLTqF4Bb2rF6x2UlVRN48xCQOhRN54psOxuYQL_BQUUXxYHDdRLdzfG-GgHyzkQbgYedWKx6oip--OoFD-P-PVcdyRiG7iBqAXqINUsDDLB5HvlCPXkBL4fRlG789ct25MnKCEcTJE1KMku9ge5QIz7wMume19bO-rgFZTufQI_lko6rfPqAKmn5__pZqACO56IaEMGR7Zw9gGXU9clPfn5s3M8yKV0w4x1cTXsfb4ad6MQvOrAFhpGMF0Q820QMAGa85dNCM5xQzAzfeJn7W4MeHIei02CuDGLfqMJF2IL3A2oxv4QvOfrDGlkneWa6yj0uQUd_HpSnMDihxMwos5svA7blQ';
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 1577836805,           -- expires at 2020-01-01 00:00:05 GMT
        "iat": 0                     -- issued at beginning of time
        }
         */
        HTTP::assertSentCount(0);

        Carbon::setTestNow('2020-01-01 00:00:00'); // not yet expired
        $this->setIntrospectionResponse(true, Carbon::createFromTimeString('2020-01-01 00:00:05')->toImmutable());
        $this->service_provider->validateAndGetClaims($token);

        $this->expectException(\Exception::class);

        // advance the clock by 6 seconds (more than 5 second expiry but less than the 10 second cache time)
        Carbon::setTestNow('2020-01-01 00:00:06');
        $this->setIntrospectionResponse(false, Carbon::createFromTimeString('2020-01-01 00:00:05')->toImmutable());
        $this->service_provider->validateAndGetClaims($token); // throws exception because token is expired, not cached
    }
}
