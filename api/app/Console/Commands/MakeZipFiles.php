<?php

namespace App\Console\Commands;

use App\Generators\UserZipGenerator;
use App\Jobs\GenerateUserFile;
use App\Models\User;
use Illuminate\Console\Command;

class MakeZipFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:make-zip-files';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a bunch of reports';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::where('sub', 'admin@test.com')->sole();

        $allUserIds = User::all('id')->pluck('id')->toArray();

        for ($i = 0; $i < 1000; $i++) {

            $generator = new UserZipGenerator(
                ids: $allUserIds,
                anonymous: false,
                dir: 'temp',
                fileName: str_shuffle(md5(microtime())),
                lang: 'en',
            );

            $generator->setUserId($user->id);

            GenerateUserFile::dispatch($generator, $user);
        }
    }
}
