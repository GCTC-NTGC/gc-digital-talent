<?php

namespace App\Console\Commands;

use App\Models\ApplicantFilter;
use App\Models\JobPosterTemplate;
use App\Models\Pool;
use App\Models\WorkStream;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

/**
 *  Temporary command to support migration of
 *  PoolStream enum to WorkStream model.
 *
 *  NOTE: Should be ran at any point during deployment.
 *  The rest of the code does not explicitly depend on this
 *  command but it should not be left since the frontend will
 *  display empty values until this has been ran.
 *
 *  TODO: Remove in #12142
 */
class MigratePoolStream extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-pool-stream';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrates the pool stream enum to work stream model';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $workStreams = WorkStream::all();

        $this->info('Updating job poster template work streams...');
        $jobPosterTemplatesUpdated = 0;
        JobPosterTemplate::whereNotNull('stream')->chunkById(200, function (Collection $jobPosterTemplates) use ($workStreams, &$jobPosterTemplatesUpdated) {
            foreach ($jobPosterTemplates as $jobPosterTemplate) {
                $stream = $workStreams->where('key', $jobPosterTemplate->stream)->first();
                if ($stream) {
                    $jobPosterTemplate->work_stream_id = $stream->id;
                    $jobPosterTemplate->save();
                    $jobPosterTemplatesUpdated++;
                } else {
                    $this->error(sprintf('Work stream (%s) not found for job poster template (%s)',
                        $jobPosterTemplate->stream,
                        $jobPosterTemplate->id));
                }
            }
        });
        $this->info("Updated $jobPosterTemplatesUpdated job poster templates");

        $this->newLine();
        $this->info('Updating pool work streams...');
        $poolsUpdated = 0;
        Pool::whereNotNull('stream')->chunkById(200, function (Collection $pools) use ($workStreams, &$poolsUpdated) {
            foreach ($pools as $pool) {
                $stream = $workStreams->where('key', $pool->stream)->first();
                if ($stream) {
                    $pool->work_stream_id = $stream->id;
                    $pool->save();
                    $poolsUpdated++;
                } else {
                    $this->error(sprintf('Work stream (%s) not found for pool (%s)',
                        $pool->stream,
                        $pool->id));
                }
            }
        });
        $this->info("Updated $poolsUpdated pools");

        $applicantFiltersUpdated = 0;
        $this->newLine();
        $this->info('Updated applicant filter work streams...');
        ApplicantFilter::whereNotNull('qualified_streams')->chunkById(200, function (Collection $applicantFilters) use ($workStreams, &$applicantFiltersUpdated) {
            foreach ($applicantFilters as $applicantFilter) {
                $streams = $workStreams->whereIn('key', $applicantFilter->qualified_streams)->pluck('id');
                if ($streams->count()) {
                    $applicantFilter->workStreams()->sync($streams);
                    $applicantFiltersUpdated++;
                } else {
                    $this->error(sprintf('Work streams (%s) not found for applicant filter (%s)',
                        implode(', ', $applicantFilter->qualified_streams),
                        $applicantFilter->id));
                }
            }
        });
        $this->info("Updated $applicantFiltersUpdated applicant filters");

        $this->newLine();
        $this->info('Migration completed');
        $this->table(['Model', 'Affected'], [
            ['JobPosterTemplate', $jobPosterTemplatesUpdated],
            ['Pool', $poolsUpdated],
            ['ApplicantFilter', $applicantFiltersUpdated],
        ]);

    }
}
