<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/* Migrates the nomination user review enum to new values
 *
 * When to run:    With deployment of the release that includes this PR's merge commit to main
 * Safe to rerun:  Yes
 * When to remove: After successfully running in prod
 */

/* Expected mapping
 *   correct -> correct
 *   incorrect/wrong person -> wrong person
 *   out of date -> incorrect/out of date
 */

#[Signature('app:migrate-review-options')]
#[Description('Migrates the nomination user review enum to new values')]
class MigrateReviewOptions extends Command
{
    // a verification query to get the total counts by field and option
    const verificationSql = <<<'SQL'
        select field, option, count from (
            select 'nominator_review' field, nominator_review option, count(*)
            from talent_nominations
            group by nominator_review
            union all
            select 'nominee_review', nominee_review, count(*)
            from talent_nominations
            group by nominee_review
            union all
            select 'advancement_reference_review', advancement_reference_review, count(*)
            from talent_nominations
            group by advancement_reference_review
        ) t
        where option is not null
        order by field, option
    SQL;

    // the table headers for the above results
    const headers = ['Field', 'Option', 'Row Count'];

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $resultsBefore = DB::select(self::verificationSql);
        $this->info('Before:');
        $this->table(self::headers, array_map(fn ($row) => (array) $row, $resultsBefore));

        // make sure all three complete together or fail together
        DB::transaction(function () {

            // update enums in nominator_review
            DB::update(
                "update talent_nominations
                set nominator_review = case
                    when nominator_review = 'INCORRECT' THEN 'WRONG_PERSON'
                    when nominator_review = 'OUT_OF_DATE' THEN 'INCORRECT_OUT_OF_DATE'
                END
                where nominator_review IN ('INCORRECT', 'OUT_OF_DATE')");

            // update enums in nominee_review
            DB::update(
                "update talent_nominations
                set nominee_review = case
                    when nominee_review = 'INCORRECT' THEN 'WRONG_PERSON'
                    when nominee_review = 'OUT_OF_DATE' THEN 'INCORRECT_OUT_OF_DATE'
                END
                where nominee_review IN ('INCORRECT', 'OUT_OF_DATE')");

            // update enums in advancement_reference_review
            DB::update(
                "update talent_nominations
                set advancement_reference_review = case
                    when advancement_reference_review = 'INCORRECT' THEN 'WRONG_PERSON'
                    when advancement_reference_review = 'OUT_OF_DATE' THEN 'INCORRECT_OUT_OF_DATE'
                END
                where advancement_reference_review IN ('INCORRECT', 'OUT_OF_DATE')");
        });

        $resultsAfter = DB::select(self::verificationSql);
        $this->info('');
        $this->info('After:');
        $this->table(self::headers, array_map(fn ($row) => (array) $row, $resultsAfter));

        return Command::SUCCESS;
    }
}
