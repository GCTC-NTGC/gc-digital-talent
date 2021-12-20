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

        // see the resources directory for the certs used for this fake jwks file
        fwrite($this->tempJwksFile, <<<RAWJSON
{
    "keys" : [ {
        "kty" : "RSA",
        "use" : "sig",
        "kid" : "key1",
        "x5c" : [ "MIIFCzCCAvOgAwIBAgIUe9oPEay/7tEjuK+IKkSZHnJRgPYwDQYJKoZIhvcNAQELBQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MCAXDTIxMTIxNDE0NDY1MFoYDzIyOTUwOTI4MTQ0NjUwWjAUMRIwEAYDVQQDDAlsb2NhbGhvc3QwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDNbRGHNnMRieeuGR0dOyr6WtdsfB0yLCLyt+jCcL7E9fxj6q0vb99ZEMmNkuDT31OsY6aA/GX897dTWYU8P4Zspm8Gm9g6qsk1J3oWcw7cNIK3YVYM3WxqvsoS8QYERSk1S3zO3Jktgz3JNlgvLEUdYo5eF9vs0dFSG3dh9h0Grk7wInmOG7CuFqqNv9BBli5ei15Hg3AD8A4xuFVyDIJ0NqZg0xGVqkQ2UO0DKGih2eEkGnAhxpy1dhEekmEPmy+UEliJk36k6dgKZciwhaMwYPGnVPMI/uBE8kwqTl6jsRgI21FJA/AIUThBWiA9S+MCdtUmCMnlNdB2z1tP2Hnn+Enr8CvDV01Ws/M7ptV/+S0gzTk/1RfXRD969m1Z5LAeM4Gs1NtTRPx3DV3JTPvD0MgliFx/4RnPzSgJO01rcH6yX9vtxqFzYxj35ds4og6KsdyK9h0e3j1yrswAfKoU/PId6E+hVK+VsJRa7kNqCkYBs8nWP08GUFUdGpOmhlazdcpZpvtrQ1N5P/kyPGjOXCKgjUfHKJMmaLIw1qZMFEW6doY3dowyRTe2cANR9L7bau2JWrLy3ojruGCxYqTAdoz0VzaxQj9db8eiHaW9zyYHxKfTGCoxOFw84XHFEu63s7jaXaK3Mcrnx7ZqYoP8D4F7sbxlZ14kWPnV2ce6zQIDAQABo1MwUTAdBgNVHQ4EFgQUBP+ncUJj7PCGtrZz52taKu3ixxAwHwYDVR0jBBgwFoAUBP+ncUJj7PCGtrZz52taKu3ixxAwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAgEAbY2+jdDvaZk6IKR4x46YC2NKurZBIWsAVR0VQTnuJ3GRG+owTFgRisMqIYLYeaGF5FxJd42N+rWbjmud/o/iCuofMyRyB9+FQ4Yf+JpITNjvv5VlZH8NrfwqWc3cVggO2IaDF46sqAqmqj3UK0oaRMsdBi9VNRaUkWr/vlOffwfKMJWBNLO9nRxb4BzB7f2VFTYT9Tp4OwuCQ2V35XTPJT17LIH8tKIq4uBanLA7lsEJ2RHNZIlAXkzfBUaYyWGT0AdnyYLPZwLvJa3qbvrq3F6gagxdLYXbVp2CqEm0wLYiV9rH+w9JR4lvIbLYKJNOR8M74JZHjPS1uqx9P3UXqDB+wJTMb9IQP/IrMeaUJoKQgKrCZoC5IAHOhLwdptQmO4q9xrSkVDWWPWYHa3goxSgv03Iol/T2WDrSRtkDFs0NPS5StIMhVLJkw9zNWg76p8Sf4iK/LRmrJfo5NN/Bcr8rsMo9b6c/iq40N6TazywKZE3cb3BsOvxCcJvskGxEiQCPFF4eoUtLOl2C1PFvUVm2xLFQpLson+dY6bYjg7RMM+MOjhtPW94sEkZ4DWiN98v7ZNtWc8Db1jNN0VA5ixrRqNAmBYbSJAbO/yfLuLb7t2UZfJmuP5qYXezVKEh/IhXYudtv+6z1l8W+4FvuB7jqW6JjMfzAchNlQMX6kyU=" ],
        "exp" : 2147483647,
        "alg" : "RS256"
    },
    {
        "kty" : "RSA",
        "use" : "sig",
        "kid" : "key2",
        "x5c" : [ "MIIFCzCCAvOgAwIBAgIUMgB4nY/QmbpTV5ajljll6ufrjEkwDQYJKoZIhvcNAQELBQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MCAXDTIxMTIxNDE0NDg1NFoYDzIyOTUwOTI4MTQ0ODU0WjAUMRIwEAYDVQQDDAlsb2NhbGhvc3QwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDVeD32xycyIXAUGDOBUa/j0rsbX5vS//CHTTY5Qfqzc3sVeuXOu4XE2LS1C30WBZrIF0PDzMxGFVY+V7yD3m3WnIg9PEjFW95iFxvRgWTnTfLrql40yBQhqoIEcLOnh68RIcV+hlRlcRywh4wKZidSM8vzLhP5qDRP9gMwXB1orCGntJX4WQV0vjmQn6rm4xV1SLdq46H940N75kBD6CII5BWjrPGpJ/ld1U7drHW560+uNq4OoShM+WESHs5swFK3Sdko8darfqgcWO/wnMkfxq4+shr9YWSWxT/NV+QfjJwbslKg+I8vRrlt0TVmJcjbS7KdNhsxITLkojfNh6oiGHKYh2b0rPCPJl15G7GqKzQdghXauNBzvEIKAT4f/qSHB/JOUMIP6PfU7wkTZ64pIB8pg0+o+Hodeyeizc+22/xdz/TGC2NvQXJx6dvDzVFCPPcPiGyn22/bDjRvykG+YCipvcZnv3XJHxWUzOU9vRE+37b/YKX+3vidub5fvjMOseK5GWEeiQPNMPKJVfmxw9i2to/KJWFLRvz3WqOEPlBn+rPnDZlUVexMOHHiGGOhXis/yg+kylfl+w9lZEuBhg6y9CFyTWEdSaqDPdJjZHMGBGs23Uc5isDrM3fFQ79od93GQePMFG2uhGEysRnaCAiY/Knx6sj7u9tLfjaOXQIDAQABo1MwUTAdBgNVHQ4EFgQUoJi32e0QJX3h7HbNW8IzpYpow3wwHwYDVR0jBBgwFoAUoJi32e0QJX3h7HbNW8IzpYpow3wwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAgEAXkVah1dZDelIDI8zyCw9OXEfaPMbkdhxEjZmzMWjdXZY0B5ni92qewnDOQHj7iALu7CJoW3xiZNNNvUHBb0mvU8D+cDBBa9iY8Dn6d88Q/KaEcMEPToZWrGjEyzJEewdxztz/lQRa7Krjd3VkXyxqkTtiMpH9U8mValcNSsrBCQiqD0b0AoO7rqyYBRFATJVdim8WXzJFv1JGWuZ4Jpi6dWMevkkAikSkRAlQX7Hv5VogiYGcz+TiRUrTmayBgTr8ZcpSxhi4x4Qze7QhzpIpljSoLwNG5KVxAi/eUiPe1OPteWaH8Dx1KmknfeyU5+ndTVAPQ9nxNoEoDTT+tTu3F6+X/PphprFVlp/c6pKLzBzLpQnqpEH+IPvpAH8Pce8rqyNQdYtXGVHyv4JHs8nIE7VcQ96RrR6Ifcwux1NZ31dateLRxNdFRMoa/QgOeseLdRzdPjNxPGBWd8WJ19qdOaQ50j9rMnZ5VUwP8fLlZtjgKugjC6HzF1UDHZVI6c8M9L58jPzn/mi/ccHzCGhhwI79g6D/DF84DiaZJSNOYJdFjP5cWAZuAnlGC4jl6OVGdX8KALgeR6eL8RzNSC00NUW0156UO5Rw69YrgXDmhAncRKhsl+IStdKmvYFPKJ3pQM3rGC3v4jq00e/TZDYB2zJ5BIe9XBwvWmnFw4NMPo=" ],
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
        $this->service_provider = new OpenIdBearerTokenService($timeZone, stream_get_meta_data($this->tempConfigFile)['uri']);

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
        $claims = $this->service_provider->validateAndGetClaims($token);
        $this->assertEquals("1234567890", $claims->get('sub'));
    }
    /**
     * @test
     * An empty string is proved and should be rejected.
     */
    public function testRejectsEmptyToken()
    {
        $this->expectException(Exception::class);
        $token = '';
        $this->service_provider->validateAndGetClaims($token);
    }
    /**
     * @test
     * An nonsense string is provided and should be rejected.
     */
    public function testRejectsNonsenseToken()
    {
        $this->expectException(Exception::class);
        $token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        $this->service_provider->validateAndGetClaims($token);
    }
    /**
     * @test
     * A token is provided but has the wrong issuer and should be rejected.
     */
    public function testRejectsIncorrectIssuer()
    {
        $this->expectException(Exception::class);
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
     * @test
     * A token is provided but has expired and should be rejected.
     */
    public function testRejectsExpiredToken()
    {
        $this->expectException(Exception::class);
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
     * @test
     * A token is provided but the issuing datetime is in the future and should be rejected.
     */
    public function testRejectsFutureToken()
    {
        $this->expectException(Exception::class);
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
     * @test
     * This is a good and valid token but was not signed by the expected key so it should be rejected
     */
    public function testRejectsTokenSignedWithDifferentKey()
    {
        $this->expectException(Exception::class);
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
}
