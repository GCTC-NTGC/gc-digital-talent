<?php

namespace Tests\Unit;

use App\Logging\Azure\ContainerLogV2Formatter;
use DateTimeImmutable;
use Exception;
use Monolog\Level;
use Monolog\LogRecord;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ContainerLogV2FormatterTest extends TestCase
{
    protected function makeRecord(
        Level $level = Level::Warning,
        string $message = 'something happened',
        array $context = [],
        array $extra = [],
    ): LogRecord {
        return new LogRecord(
            datetime: new DateTimeImmutable(),
            channel: 'test',
            level: $level,
            message: $message,
            context: $context,
            extra: $extra,
        );
    }

    public function testFormatProducesJsonWithLowercaseLevelKey()
    {
        $formatted = (new ContainerLogV2Formatter())->format($this->makeRecord(Level::Warning, 'Database connection took longer than expected.'));

        $decoded = json_decode(trim($formatted), true);
        $this->assertSame('WARNING', $decoded['level']);
        $this->assertSame('Database connection took longer than expected.', $decoded['message']);
        $this->assertArrayNotHasKey('LogLevel', $decoded);
    }

    #[DataProvider('levelMappingProvider')]
    public function testFormatMapsMonologLevelsToContainerLogV2Levels(Level $level, string $expected)
    {
        $decoded = json_decode(trim((new ContainerLogV2Formatter())->format($this->makeRecord($level))), true);

        $this->assertSame($expected, $decoded['level']);
    }

    public static function levelMappingProvider(): array
    {
        return [
            'debug' => [Level::Debug, 'DEBUG'],
            'info' => [Level::Info, 'INFO'],
            'notice' => [Level::Notice, 'INFO'],
            'warning' => [Level::Warning, 'WARNING'],
            'error' => [Level::Error, 'ERROR'],
            'critical' => [Level::Critical, 'CRITICAL'],
            'alert' => [Level::Alert, 'CRITICAL'],
            'emergency' => [Level::Emergency, 'CRITICAL'],
        ];
    }

    public function testFormatOmitsEmptyContextAndExtra()
    {
        $decoded = json_decode(trim((new ContainerLogV2Formatter())->format($this->makeRecord())), true);

        $this->assertArrayNotHasKey('context', $decoded);
        $this->assertArrayNotHasKey('extra', $decoded);
        $this->assertArrayNotHasKey('datetime', $decoded);
        $this->assertArrayNotHasKey('channel', $decoded);
    }

    public function testFormatIncludesContextAndExtraWhenPresent()
    {
        $decoded = json_decode(trim((new ContainerLogV2Formatter())->format($this->makeRecord(
            context: ['CorrelationID' => 'abc123'],
            extra: ['ApplicationID' => 'app-url'],
        ))), true);

        $this->assertSame('abc123', $decoded['context']['CorrelationID']);
        $this->assertSame('app-url', $decoded['extra']['ApplicationID']);
    }

    public function testFormatNormalizesExceptionsInContext()
    {
        $decoded = json_decode(trim((new ContainerLogV2Formatter())->format($this->makeRecord(
            level: Level::Error,
            context: ['exception' => new Exception('boom')],
        ))), true);

        $this->assertSame('boom', $decoded['context']['exception']['message']);
    }

    public function testFormatWritesOneJsonLinePerRecordInFormatBatch()
    {
        $formatted = (new ContainerLogV2Formatter())->formatBatch([
            $this->makeRecord(Level::Info, 'first'),
            $this->makeRecord(Level::Error, 'second'),
        ]);

        $lines = array_values(array_filter(explode(PHP_EOL, $formatted)));
        $this->assertCount(2, $lines);
        $this->assertSame('first', json_decode($lines[0], true)['message']);
        $this->assertSame('second', json_decode($lines[1], true)['message']);
    }
}
