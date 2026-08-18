<?php

namespace Tests\Unit;

use App\Support\LogUtil;
use GuzzleHttp\Psr7\Response as Psr7Response;
use Illuminate\Http\Client\Response;
use Tests\TestCase;

class LogUtilTest extends TestCase
{
    public function testCleanStringReplacesAllNewlineVariantsWithSpaces()
    {
        $this->assertSame(
            'line one line two line three',
            LogUtil::cleanString("line one\nline two\r\nline three")
        );
    }

    public function testCleanStringLeavesStringsWithoutNewlinesUnchanged()
    {
        $this->assertSame('no newlines here', LogUtil::cleanString('no newlines here'));
    }

    public function testCleanArrayMasksClientSecret()
    {
        $result = LogUtil::cleanArray([
            'grant_type' => 'authorization_code',
            'client_secret' => 'super-secret-value',
        ]);

        $decoded = json_decode($result, true);
        $this->assertSame('authorization_code', $decoded['grant_type']);
        $this->assertSame('******************', $decoded['client_secret']);
        $this->assertStringNotContainsString('super-secret-value', $result);
    }

    public function testCleanArrayMasksPassword()
    {
        $result = LogUtil::cleanArray(['password' => 'letmein']);

        $decoded = json_decode($result, true);
        $this->assertSame('*******', $decoded['password']);
        $this->assertStringNotContainsString('letmein', $result);
    }

    public function testCleanArrayLeavesOtherKeysUntouched()
    {
        $result = LogUtil::cleanArray(['code' => 'abc123', 'redirect_uri' => 'https://example.com']);

        $decoded = json_decode($result, true);
        $this->assertSame('abc123', $decoded['code']);
        $this->assertSame('https://example.com', $decoded['redirect_uri']);
    }

    public function testResponseContextReturnsStatusAndBodyPreview()
    {
        $response = new Response(new Psr7Response(500, [], 'error details'));

        $context = LogUtil::responseContext($response);

        $this->assertSame(500, $context['status']);
        $this->assertSame('error details', $context['body-preview']);
    }

    public function testResponseContextSquishesNewlinesAndExtraWhitespace()
    {
        $response = new Response(new Psr7Response(400, [], "  bad   request\ndetails  \r\n here  "));

        $context = LogUtil::responseContext($response);

        $this->assertSame('bad request details here', $context['body-preview']);
    }

    public function testResponseContextTruncatesLongBodies()
    {
        $response = new Response(new Psr7Response(500, [], str_repeat('a', 1000)));

        $context = LogUtil::responseContext($response);

        $this->assertStringEndsWith('...', $context['body-preview']);
        $this->assertSame(503, mb_strlen($context['body-preview']));
    }
}
