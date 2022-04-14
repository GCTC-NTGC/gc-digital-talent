<?php

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateFilter;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ConvertOvertimeEnum extends Migration
{

    protected function convertOperationalEnumValue($oldValue, $newValue)
    {
        $converEnumValue = function($item) use ($oldValue, $newValue) {
            if($item === $oldValue) {
                return $newValue;
            }
            return $item;
        };

        $users = User::whereJsonContains('accepted_operational_requirements', $oldValue)->get();
        foreach($users as $user) {
            $user->accepted_operational_requirements = collect($user->accepted_operational_requirements)
                ->map($converEnumValue)->toArray();
            $user->save();
        }
        $poolCandidates = PoolCandidate::whereJsonContains('accepted_operational_requirements', $oldValue)->get();
        foreach ($poolCandidates as $poolCandidate) {
            $poolCandidate->accepted_operational_requirements = collect($poolCandidate->accepted_operational_requirements)
                ->map($converEnumValue)->toArray();
            $poolCandidate->save();
        }
        $pools = Pool::whereJsonContains('operational_requirements', $oldValue)->get();
        foreach ($pools as $pool) {
            $pool->operational_requirements = collect($pool->operational_requirements)
                ->map($converEnumValue)->toArray();
            $pool->save();
        }
        $poolCandidateFilters = PoolCandidateFilter::whereJsonContains('operational_requirements', $oldValue)->get();
        foreach($poolCandidateFilters as $poolCandidateFilter) {
            $poolCandidateFilter->operational_requirements = collect($poolCandidateFilter->operational_requirements)
                ->map($converEnumValue)->toArray();
            $poolCandidateFilter->save();
        }
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->convertOperationalEnumValue("OVERTIME", "OVERTIME_SCHEDULED");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $this->convertOperationalEnumValue("OVERTIME_SCHEDULED", "OVERTIME");
    }
}
