<?php

namespace App\Console\Commands;

use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateSearchRequest;
use App\Models\TalentNomination;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DepartmentDeduplication extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:department-deduplication';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Following a spreadsheet map, update references to duplicates then delete the duplicates';

    /**
     * Tables to reference, computed via SQL command
     * https://dba.stackexchange.com/questions/265732/postgresql-how-to-list-all-foreign-key-link-to-primary-key-of-a-table
     *
     * pools	department_id
     * department_user_next_role	department_id
     * pool_candidate_search_requests	department_id
     * pool_candidates	placed_department_id
     * team_department	department_id
     * users	computed_department
     * department_user_career_objective	department_id
     * talent_nominations	nominator_fallback_department_id
     * talent_nominations	advancement_reference_fallback_department_id
     */

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // map created from spreadsheet
        $departmentMap = [
            [
                'name_en' => 'Accessibility Standards Canada',
                'keep_number' => 903,
                'remove_number' => 199,
            ],
            [
                'name_en' => 'Housing, Infrastructure and Communities Canada',
                'keep_number' => 201,
                'remove_number' => 142,
            ],
            [
                'name_en' => 'Innovation, Science and Economic Development Canada',
                'keep_number' => 33,
                'remove_number' => 207,
            ],
            [
                'name_en' => 'Polar Knowledge Canada',
                'keep_number' => 171,
                'remove_number' => 211,
            ],
            [
                'name_en' => 'Prairies Economic Development Canada',
                'keep_number' => 210,
                'remove_number' => 212,
            ],
            [
                'name_en' => 'Prairies Economic Development Canada',
                'keep_number' => 210,
                'remove_number' => 44,
            ],
            [
                'name_en' => 'Public Prosecution Service of Canada',
                'keep_number' => 19,
                'remove_number' => 200,
            ],
            [
                'name_en' => 'Registrar of the Supreme Court of Canada',
                'keep_number' => 80,
                'remove_number' => 214,
            ],
            [
                'name_en' => 'Canada Border Services Agency',
                'keep_number' => 85,
                'remove_number' => 38,
            ],
            [
                'name_en' => 'Canada Revenue Agency',
                'keep_number' => 130,
                'remove_number' => 122,
            ],
        ];

        // run through each array in the map
        foreach ($departmentMap as $departmentMapObject) {

            /** @var \App\Models\Department | null $departmentToKeep */
            $departmentToKeep = Department::where('department_number', $departmentMapObject['keep_number'])->first();
            /** @var \App\Models\Department | null $departmentToRemove */
            $departmentToRemove = Department::where('department_number', $departmentMapObject['remove_number'])->first();

            // short circuit if department(s) not found
            if ($departmentToKeep === null || $departmentToRemove === null) {
                $this->info("Department name: {$departmentMapObject['name_en']} was SKIPPED");
                $this->info('Department to keep or department to remove not found');

                continue;
            }

            $updateCounter = 0;

            //
            // ELOQUENT SECTION
            //

            // Pools
            $pools = Pool::where('department_id', $departmentToRemove->id)->get();
            /** @var \App\Models\Pool $pool */
            foreach ($pools as $pool) {
                $pool->department_id = $departmentToKeep->id;
                $pool->save();
                $updateCounter++;
            }

            // PoolCandidateSearchRequests
            $poolCandidateSearchRequests = PoolCandidateSearchRequest::where('department_id', $departmentToRemove->id)->get();
            /** @var \App\Models\PoolCandidateSearchRequest $poolCandidateSearchRequest */
            foreach ($poolCandidateSearchRequests as $poolCandidateSearchRequest) {
                $poolCandidateSearchRequest->department_id = $departmentToKeep->id;
                $poolCandidateSearchRequest->save();
                $updateCounter++;
            }

            // PoolCandidates
            $poolCandidates = PoolCandidate::where('placed_department_id', $departmentToRemove->id)->get();
            /** @var \App\Models\PoolCandidate $poolCandidate */
            foreach ($poolCandidates as $poolCandidate) {
                $poolCandidate->placed_department_id = $departmentToKeep->id;
                $poolCandidate->save();
                $updateCounter++;
            }

            // team_department
            // SKIP

            // Users
            $users = User::where('computed_department', $departmentToRemove->id)->get();
            /** @var \App\Models\User $user */
            foreach ($users as $user) {
                $user->computed_department = $departmentToKeep->id;
                $user->save();
                $updateCounter++;
            }

            // TalentNominations - nominator fallback
            $nominatorNominations = TalentNomination::where('nominator_fallback_department_id', $departmentToRemove->id)->get();
            /** @var \App\Models\TalentNomination $nominatorNomination */
            foreach ($nominatorNominations as $nominatorNomination) {
                $nominatorNomination->nominator_fallback_department_id = $departmentToKeep->id;
                $nominatorNomination->save();
                $updateCounter++;
            }

            // TalentNominations - advancement fallback
            $advancementNominations = TalentNomination::where('advancement_reference_fallback_department_id', $departmentToRemove->id)->get();
            /** @var \App\Models\TalentNomination $advancementNomination */
            foreach ($advancementNominations as $advancementNomination) {
                $advancementNomination->advancement_reference_fallback_department_id = $departmentToKeep->id;
                $advancementNomination->save();
                $updateCounter++;
            }

            //
            // FACADE
            //
            // pivot tables handled in a simpler way doing this

            // pivot department_user_next_role
            $nextRoleRowsTouched = DB::table('department_user_next_role')->where('department_id', $departmentToRemove->id)->update([
                'department_id' => $departmentToKeep->id,
            ]);
            $updateCounter = $updateCounter + $nextRoleRowsTouched;

            // pivot department_user_career_objective
            $careerObjectiveRowsTouched = DB::table('department_user_career_objective')->where('department_id', $departmentToRemove->id)->update([
                'department_id' => $departmentToKeep->id,
            ]);
            $updateCounter = $updateCounter + $careerObjectiveRowsTouched;

            // complete, now log
            $this->info("Department name: {$departmentMapObject['name_en']}");
            $this->info("Replacing department {$departmentMapObject['remove_number']} with department {$departmentMapObject['keep_number']}");
            $this->info("Records touched: $updateCounter");

            // safe to delete duplicate
            $response = $departmentToRemove->forceDelete();
            $response === true ?
            $this->info("Department {$departmentMapObject['remove_number']} deleted") :
            $this->info("Department {$departmentMapObject['remove_number']} failed to be deleted");
        }
    }
}
