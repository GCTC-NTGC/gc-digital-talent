<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\Classification;
use Database\Helpers\ApiEnums;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CreateDigitalCareersPools extends Command
{
    // this command creates 32 pools, 4 classifications by 8 streams
    // connected to a classification and 5 essential skills

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:digital_careers_pools';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create 32 pools';

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
        // create 32 pools
        $ITLevels = [1, 2, 3, 4];
        $poolStreams = ApiEnums::poolStreams();
        $dateNow = Carbon::now();
        $ownerId = User::where('sub', 'ilike', 'admin@test.com')->first()->toArray()['id'];

        foreach ($ITLevels as $index => $level) {
            foreach ($poolStreams as $index => $stream) {

                // create pool with some info
                $newPool = Pool::create([
                    'user_id' => $ownerId, // replace with whoever
                    'name' => [
                        'en' => "Digital Careers",
                        'fr' => "Carrières Numériques",
                    ],
                    'key_tasks' => [
                        'en' => "Various IT related work tasks.",
                        'fr' => "Diverses tâches liées à l'informatique.",
                    ],
                    'stream' => $stream,
                    'expiry_date' => $dateNow,
                    'published_at' => $dateNow,
                    'is_remote' => true,
                    'security_clearance' => ApiEnums::POOL_ADVERTISEMENT_RELIABILITY,
                    'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_VARIOUS,
                    'publishing_group' => ApiEnums::PUBLISHING_GROUP_IT_JOBS,
                ]);

                // connect pool essential skills
                $skillsToAdd = [];

                $teamworkId = Skill::where('key', 'ilike', 'teamwork')->first()->toArray()['id'];
                $analyticalThinkingId = Skill::where('key', 'ilike', 'analytical_thinking')->first()->toArray()['id'];
                $clientFocusId = Skill::where('key', 'ilike', 'client_focus')->first()->toArray()['id'];
                $verbalCommId = Skill::where('key', 'ilike', 'verbal_communication')->first()->toArray()['id'];
                $writtenCommId = Skill::where('key', 'ilike', 'written_communication')->first()->toArray()['id'];

                array_push($skillsToAdd, $teamworkId, $analyticalThinkingId, $clientFocusId, $verbalCommId, $writtenCommId);
                $newPool->essentialSkills()->sync($skillsToAdd);

                // connect classification
                $classificationId = Classification::where('group', 'ilike', 'IT')->where('level', $level)->first()->toArray()['id'];
                $newPool->classifications()->sync([$classificationId]);
            }
        }
    }
}
