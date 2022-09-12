<?php

namespace App\Console\Commands;

use App\Models\SkillFamily;
use App\Models\Skill;
use Illuminate\Console\Command;

// This artisan command is to remove all existing temporary skills and skill experiences in preparation for #3684.
// Once this migration has been executed this command can be deleted.
class DeleteAllSkillsAndSkillFamilies extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'delete:skills_and_skill_families';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete all the existing skill and skill families in the application';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        SkillFamily::truncate();
        SKill::truncate();
        return 0;
    }
}
