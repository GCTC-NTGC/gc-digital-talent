<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:backfill-talent-sources')]
#[Description('Backfills talent_sources on applicant_filters for talent requests that pre-date the field.')]
class BackfillTalentSources extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $updatedCount = DB::update(<<<'SQL'
            UPDATE applicant_filters
            SET talent_sources = '["QUALIFIED_IN_POOL"]'
            WHERE id IN (
                SELECT applicant_filter_id FROM talent_requests
                WHERE created_at < '2026-07-24'
            )
            AND (talent_sources IS NULL OR talent_sources = '[]'::jsonb)
            SQL
        );

        $this->info("{$updatedCount} applicant_filters rows backfilled with talent sources");
    }
}
