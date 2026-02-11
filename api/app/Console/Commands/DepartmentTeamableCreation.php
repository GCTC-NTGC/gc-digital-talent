<?php

namespace App\Console\Commands;

use App\Models\Department;
use Illuminate\Console\Command;

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
