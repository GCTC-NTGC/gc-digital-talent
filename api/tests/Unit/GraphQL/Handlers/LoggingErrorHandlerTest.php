<?php

namespace Tests\Unit\GraphQL\Handlers;

use App\GraphQL\Handlers\LoggingErrorHandler;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Tests\TestCase;

class LoggingErrorHandlerTest extends TestCase
{
    public function testLogsExtensionsAlongsideMessage()
    {
        Log::spy();

        $validationException = ValidationException::withMessages([
            'pool' => ['INVALID_COMMUNITY_DEPARTMENT_COMBO'],
        ]);
        $error = new Error('Validation failed for the field [createPool].', null, null, null, null, $validationException);

        (new LoggingErrorHandler())($error, fn ($e) => ['message' => $e?->getMessage()]);

        Log::shouldHaveReceived('info')
            ->once()
            ->with(
                'GraphQL Error: Validation failed for the field [createPool].',
                ['extensions' => ['validation' => ['pool' => ['INVALID_COMMUNITY_DEPARTMENT_COMBO']]]],
            );
    }

    public function testLogsWithEmptyContextWhenNoExtensionsPresent()
    {
        Log::spy();

        $error = new Error('Some plain error.');

        (new LoggingErrorHandler())($error, fn ($e) => ['message' => $e?->getMessage()]);

        Log::shouldHaveReceived('info')
            ->once()
            ->with('GraphQL Error: Some plain error.', []);
    }

    public function testLogsQueryDepthErrorsAtErrorLevel()
    {
        Log::spy();

        $error = new Error('Max query depth should be 10 but got 15.');

        (new LoggingErrorHandler())($error, fn ($e) => ['message' => $e?->getMessage()]);

        Log::shouldHaveReceived('error')
            ->once()
            ->with('GraphQL Error: Max query depth should be 10 but got 15.', []);
        Log::shouldNotHaveReceived('info');
    }

    public function testPassesNullErrorThroughWithoutLogging()
    {
        Log::spy();

        $result = (new LoggingErrorHandler())(null, fn ($e) => ['passed' => $e]);

        $this->assertSame(['passed' => null], $result);
        Log::shouldNotHaveReceived('info');
        Log::shouldNotHaveReceived('error');
    }

    public function testKeepsPipelineGoingByCallingNextWithTheError()
    {
        Log::spy();

        $error = new Error('Some plain error.');

        $result = (new LoggingErrorHandler())($error, fn ($e) => ['message' => $e?->getMessage()]);

        $this->assertSame(['message' => 'Some plain error.'], $result);
    }
}
