<?php

namespace App\Console\Commands;

use App\Generators\UserCsvGenerator;
use App\Jobs\GenerateUserFile;
use App\Models\User;
use Illuminate\Console\Command;

class MakeCsvFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:make-csv-files';

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

        for ($i = 0; $i < 1000; $i++) {

            $generator = new UserCsvGenerator(
                fileName: str_shuffle(md5(microtime())),
                dir: 'temp',
                lang: 'en',
            );

            $generator
                ->setUserId($user->id);

            GenerateUserFile::dispatch($generator, $user);
        }
    }
}
