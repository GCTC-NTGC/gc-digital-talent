<?php

namespace App\Console\Commands;

use App\Models\Department;
use Illuminate\Console\Command;

/**
 * Create teamable records in the teams table for departments
 * Only creates if a record does not already exist, can be re-run
 * Can be run immediately
 * To remove sometime (a few weeks maybe) after department team creation is testable in frontend
 */
class DepartmentTeamableCreation extends Command
{
    /**
     * The name and signature of the console command.
     *
     *   * @var string
     */
    protected $signature = 'app:department-teamable-creation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure departments have a teamable relation, creating one if not present';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $departments = Department::all();

        foreach ($departments as $department) {
            $department->team()->firstOrCreate([], [
                'name' => 'department-'.$department->id,
            ]);
        }

        return Command::SUCCESS;
    }
}
