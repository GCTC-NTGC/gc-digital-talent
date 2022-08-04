<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\PoolCandidate;

class PoolCandidateDataToUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    public function up()
    {
        // update table users with data from table pool_candidates
        DB::statement('UPDATE users
                    SET is_woman = p.is_woman,
                        has_disability = p.has_disability,
                        is_indigenous = p.is_indigenous,
                        is_visible_minority = p.is_visible_minority,
                        has_diploma = p.has_diploma,
                        language_ability = p.language_ability,
                        location_preferences = p.location_preferences,
                        accepted_operational_requirements = p.accepted_operational_requirements,
                        expected_salary = p.expected_salary
                    FROM pool_candidates p
                    WHERE users.id = p.user_id');

        // insert data into cmo_users and classifications_user using PoolCandidate and User models with query builder
        $allPoolCandidates = PoolCandidate::all();
        foreach($allPoolCandidates as $candidate){
            $user = $candidate->user()->getChild();

            // build arrays of Assets and Classifications existing on PoolCandidate model and attached User
            $classificationsCandidate = $candidate->expectedClassifications()->pluck('classifications.id')->toArray();
            $assetsCandidate = $candidate->cmoAssets()->pluck('cmo_assets.id')->toArray();
            $classificationsUser = $user->expectedClassifications()->pluck('classifications.id')->toArray();
            $assetsUser = $user->cmoAssets()->pluck('cmo_assets.id')->toArray();

            // merge into a combined Assets array as well as Classifications array, then remove duplicates
            $combinedClassifications = array_merge($classificationsCandidate, $classificationsUser);
            $combinedClassificationsDedupe = array_unique($combinedClassifications);
            $combinedAssets = array_merge($assetsCandidate, $assetsUser);
            $combinedAssetsDedupe = array_unique($combinedAssets);

            // sync the User with the de-duped arrays
            $user->expectedClassifications()->sync($combinedClassificationsDedupe);
            $user->cmoAssets()->sync($combinedAssetsDedupe);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // not a reversible migration
    }
}
