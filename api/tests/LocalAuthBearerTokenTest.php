<?php

use App\Services\LocalAuthBearerTokenService;
use App\Services\Contracts\BearerTokenServiceInterface;
use Lcobucci\Clock\FrozenClock;

class LocalAuthBearerTokenTest extends TestCase
{
    /**
     * @var BearerTokenServiceInterface
     */
    protected $service_provider;

    protected DateTimeImmutable $now;
    protected DateInterval $allowableClockSkew;


    protected function setUp(): void
    {
        // generate keys and tokens for testing at https://jwt.io/#debugger-io
        // make sure you set algorithm to RS256
        $issuer = 'http://test.com';
        $publicKey = file_get_contents('tests/resources/key1-cert.pem');
        if(!$publicKey)
            throw new Exception('Failed to load public key from file');

        $this->now = new DateTimeImmutable('2020-01-01 00:02:00', new DateTimeZone('UTC'));
        $this->allowableClockSkew = DateInterval::createFromDateString('4 minutes');
        $this->service_provider = new LocalAuthBearerTokenService(
            $issuer,
            $publicKey,
            new FrozenClock($this->now),
            $this->allowableClockSkew
        );

        parent::setUp();

    }
    /**
     * @test
     * A valid token is provided and validated.  The test checks that the right sub value is returned.
     */
    public function testAcceptsGoodTokenAndReturnsCorrectSub()
    {
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjowLCJleHAiOjIxNDc0ODM2NDd9.sIaKxvPPqAb9adEmXitcB3UCM2NU6_fxsPNdiD430hHsgEe_RQWIipQAQlp9gWDVRTQ_frESNmf65p0wklEz6rgo8JvmXPOm5xAQlbnab0JDMwq4ZG3cp5X-kqLLTbG2yj6T_zygATh9ZrgoLlCb-Zs56crxjOYBEItrKqez3YR2ZURQStBtrg9mIssFyErjRO_QVClf9FK-x68rdRJOtYSMhAImhtTfNTq0NnvrnduJQe7OQggKjZG_7reI5difVf8GVgoBbniLxYR3ZEPTkl7m6XWhSqcs-E3C0m98rVX7oitkX38HvaBXzfE1Ow9qseeQqB3UldBsYnLOyMZI0Nvp19SROT3Ss6rVXWxqsO6W8nuO-33WAmtcDZ-8IaZruO-e_bFpvev7HTEbqFFycV3uZCpg9B3gzfZR6mXRx-B7mPJC8PIjDbUMg9oFhnt_UhwgsdFQCXd2q_Dh_BMX9jXCpsStGneA-XOKuR3gpY0LsqB8ITH2XzGMIdCAHKWGZIAHctGt2v7bkpE9cgICfJxYeEcDW-v8IFTDOYPBjmB2CpvUNfZxosI1lYcJMa7-0wAyiw-ZelQj3Xt7xUwa9RqwUrSS09OGgtklR0azkrSOksI4ihj1l4QIKviRnZlfMuV3xnMa8NYXOtOk_dkRaK2nba0kU2ijILjpvQXzBAQ';
        /** analyze token at https://jwt.io/
         {
           "iss": "http://test.com",    -- arbitrary issuer
           "sub": "1234567890",         -- arbitrary subscriber string
           "iat": 0,                    -- issued at beginning of time
           "exp": 2147483647            -- expires at end of time
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
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vd3Jvbmdkb21haW4uY29tIiwic3ViIjoiMTIzNDU2Nzg5MCIsImlhdCI6MCwiZXhwIjoyMTQ3NDgzNjQ3fQ.nQ1Yzl2qTqvaKXZ7RuJ5dzhd4udsSCYurASqoov1-eaYWi4PfUI-UGEPRTBqfQ0xLEasjXa_a20Od5lrLvvlcDrfjI-K018-rsfveHpbGWKW7R-Yxw6vbfghVqpGF3HMSowOqnAOkRWFbHvYMPAV75Rjto6MoQASmJ2gGTrYtUdzerHVgDaaCH4idwg4eDhiDktD1-75t7iITPIik2Lcm1SycL9wf20Cl166njNtjNIwlcLj666qypj8qbeUgzRzOCRf4-zEoA9oX4shN-QVzokmlgmH-13vApn3a67YJ-aYvnTIYK2Kq1BEB2NJGdkfXAINbYToFj3-L5OHcy8u4EFmoGsPTVHwHXqKosMu2ItlzBGuyGKnNZtAdlHoI22cQjp74T6kJ8_XrPuz0PJoolHT2outBGd9SgE5ociymjXIO-gex-PLE_ysACKzjOxkNJaEbXIvxsqVcGxDjxyN5wcWGkw1Ca1yHv2uyUhObTN2SG59STq6AAzErvnjOLPVHmQTTXklaIFwJmC7NZEkQmb4obQUo9Q1gilkzR4A0zzY96zskOXU7djcWS9Bmf-YHdIC0APHoTkCBt8GaaYyQL6MDmeWjCjL6KdOedLgJ9YxXzmzei8p4C6Qjq9GSZzTa5sYldB9-CYU5JBtQRMoMzC1xOsvCikoZf7DhgeZ8y0';
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
    public function testRejectsExpiredToken()
    {
        $this->expectException(Exception::class);
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjowLCJleHAiOjF9.dZ5b1kNmaZeJys0iS6pytjh74Avzu9u5M1zLoIMKXrABRP2bf-D7IYtkajFv-fyiOwnKUHYZgLLv8HFIykOLlFvK0nJFXPSKOXo_ndPUi93FNQA8POZbxTbErD34jotEbu9WW2gmlL1cp-fFLpDEeF3Gth4PZ--ixD0PBEEP9zsSHGMm2_8JFZwjv3AXRE6a1iJ3nd_zKfI8JhRG5QvTz8yJfksEDgC3PP5NvjT0UG8U1dABptcKBibLznayrIsoxLrTN_YqZdsC0Mog0l-Pvs5V51K4JMvolwdsZsl5AIYl8ga0tfanNmXC0XLg3KeaRyDnOuouwh1TYvrQi1U4I6KftCO7eySQB0Ve51i84189CBpikbyJsWq0Zcn1OjYUjqIrnbmISKKTYlvj4s8gsRJwZP6waPBYPVZDkM9tudQ6O30e454bCoRGZecx6KlvEQi6FWHluywqMHsNBcdIfJ1Qh7aOcEUBMICHZLdrgZrHiXLCcEL8dXqKpd-BAV1nyd_0-8_1AGlIjM_kJZL6pI1p5xoBr0jFCCyXCDQ_40LQc6Zaj1oF60gj66wMOwLmF2YwivPQL0vd3UU74M9nVyvGsyaUdiCmkhelG-vqdqFr7HTmrks9NRWZZFzKlsNHzK1hTBC5innuN0GL1Xn3O5FX80XFKg5x-cFeyUpb8rU';
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
     * A token is provided but the issuing datetime is in the future and should be rejected.
     */
    public function testRejectsFutureToken()
    {
        $this->expectException(Exception::class);
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoyMTQ3NDgzNjQ2LCJleHAiOjIxNDc0ODM2NDd9.LUdcCTwZmGlVL945V5pT1kHlMHVuVeEwW86zq0iprKeNyU3b63VroSyz5KuXBOPIXuD59a_mg1DjrzlFN7byucrHIhECZoPoG0tCaCRibrI1bcc13jAm39VffIa6EAKBSYQlSuOP7y4JJoxa1NceeLBkfycONYQrAoipxayuOYzFvZUdxKGZemUsM0mHL57Pz971komENoXfnsAG0ym97N99E0ufckoEr1NvGLnOEFaMxk802Y6esP9D49OAHVi9FBQLWMgiL3n6qBVRgvhUbiknejIOvlLD2X3Oad7eLgCqGO-fyCnZHySEXAUvDq9z_a49SrzOLH1oJs_RHtoKUq8-45xuKtNs_VAV83yjbKJ_tkuY8MaQaUKwjVARPFdMxLmKBsHe8lsWrbe6HJcXP__nLf_Uug-RFPVJHTpcuH7lcPhP1RTfsq965xRHs6ikJ8cGbcRMeJr5bG1z2bovu0sji9KPJ4ZNkbRfmNYzS_ET-DmdF4cnqoJHlAH6S5bE0fyfn0kV6hxA9rhq-hUB6fYS2dJnjth-cklr5Ar2Kh5nI7CkzTMYCmULKuv7q2wPb3NqsX2PYS2_cSC5bZEr9EzTWQEZN2CGSJNWImHHuPJzs4bcmTEW1MeiR9YSnA2cg6SEItC2QLa4Ltzjd73MFyDlgPTyzOB6IuT8rkFzYd4';
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
    public function testRejectsTokenSignedWithDifferentKey()
    {
        $this->expectException(Exception::class);
        // actually signed with key2
        $token = 'eyJraWQiOiJrZXkxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjowLCJleHAiOjIxNDc0ODM2NDd9.u_otWXoGZ778-9_NL2phYjqqs7czu1z11WiN3gZaD2t8rdNVemPs02-oNYeb_wbvynXLOLwwb4xdrC47kqcqCzTmvVh1qgUOHRbPiaDPffZx6fY6VMhEr7Bj5HZkCmZF9YQwb4tTFhRezE2wZPLPgggCgdSbph0vgbW_fwZFqBa8TG6AuxD49rvjQ9ySmuBMdIllJt7o76ZKfVKUpCkh4vyTLrQLnd5OWbMONOuE7J3piiAduP6Iyc6fbuNwkCFmTN1VxwgK2vXNSKDbBaokAlN-d2GXsArMhumQZdKnLfG-pH3oL_ElfZIOoO6xXXLXhMez9TRAzHec116TEawspDVrAMZHDGNwIY-IfAiSkjgs5UagAME9GB2NOsEEqOXgODi-GWSrxbyJvbxbKp_Kk2v-R-sUAV__TXlQgSwYNWW6AXsCNQImrCggztpOO-P43QS40JQH-d0PRTlhE3UXaWaGifeuuC7OPao8snzwDPyYeD1wZQAE36vJ2Lt-l3MOCMnuRXaLKrsgUS9Fdj7oAihBGxrgLHtCo7ge6w60ipilMWjZvQLp3JRgJZKs_CDL73_Z5IaksS99HKpSzI-oufIMTvVu1ipk7OWn_zqHSJ7lTBoCvKmh4o9BqYQio9mL7ExrbBZ5wHhDGIOGENCvHXSz2oceoVM0Y7jlqKlHb4w';
        /** analyze token at https://jwt.io/
         * {
         *   "iss": "http://test.com",    -- arbitrary issuer
         *   "sub": "1234567890",         -- arbitrary subscriber string
         *   "iat": 0,                    -- issued at beginning of time
         *   "exp": 2147483647            -- expires at end of time
         * }
         */
        $this->service_provider->validateAndGetClaims($token);
    }
        /**
     * @test
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
        $claims = $this->service_provider->validateAndGetClaims($token);  // will throw an exception for rejected tokens

        // checks that the test was properly set up
        $this->assertTrue($this->now > $claims->get('exp'), 'test value for now was not after strict expiry date');
        $this->assertTrue($this->now < $claims->get('exp')->add($this->allowableClockSkew), 'test value for now was not within the expiry date plus allowed skew');
    }
}
