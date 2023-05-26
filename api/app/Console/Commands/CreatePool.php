<?php

namespace App\Console\Commands;

use App\Models\Pool;
use Illuminate\Console\Command;

class CreatePool extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-pool
                            {--state= : The factory state to use }
                            {--name= : The name to assign to the pool in both English and French }
                            {--userId= : The user ID of the owner of the pool }
                            {--teamId= : The team ID to assign to the pool }
                            {--essentialSkillId=* : One or more skills IDs to associate as essential to the pool }
                            {--classificationId=* : One or more classification IDs to associate to the pool }
                            {--stream= : The HR stream to associate with the pool }
                            ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new pool';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $attributes = [
            'advertisement_language' => 'ENGLISH' // avoid bilingual validation errors
        ];

        $userId = $this->option('userId');
        if (!empty($userId)) {
            $attributes['user_id'] = $userId;
        }
        $teamId = $this->option('teamId');
        if (!empty($teamId)) {
            $attributes['team_id'] = $teamId;
        }
        $name = $this->option('name');
        if (!empty($name)) {
            $attributes['name'] = ['en' => $name, 'fr' => $name];
        }
        $stream = $this->option('stream');
        if (!empty($stream)) {
            $attributes['stream'] = $stream;
        }

        $pool = null;
        $state = $this->option('state');
        if (empty($state)) {
            $pool = Pool::factory()
                ->create($attributes);
        } else {
            $pool = Pool::factory()
                ->$state()
                ->create($attributes);
        }

        $essentialSkillIds = $this->option('essentialSkillId');
        if (is_array($essentialSkillIds))
            $pool->essentialSkills()->sync($essentialSkillIds);
        if (is_string($essentialSkillIds))
            $pool->essentialSkills()->sync([$essentialSkillIds]);

        $classificationIds = $this->option('classificationId');
        if (is_array($classificationIds))
            $pool->classifications()->sync($classificationIds);
        if (is_string($classificationIds))
            $pool->classifications()->sync([$classificationIds]);

        $this->info($pool->toJson());
    }
}
