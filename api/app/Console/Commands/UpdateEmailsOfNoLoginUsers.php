<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class UpdateEmailsOfNoLoginUsers extends Command
{
    // this command updates the email fields of users who have NULL for the sub field OR sub is identical to email
    // updates to tack on a tag to those emails, freeing the original emails for reuse

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:obsolete_user_email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update email of user accounts deemed "obsolete".';

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
        $addedTag = "+admin_entry";
        $allUsers = User::all();

        foreach($allUsers as $user){

            if ($user->sub == null || ($user->email == $user->sub)) {

                $originalEmail = $user->email;
                list($emailHandle, $domain) = explode("@", $originalEmail);
                $newEmail = $emailHandle . $addedTag . "@" . $domain;

                $user->email = $newEmail;
                $user->save();
            }
        }
    }
}
// php artisan update:obsolete_user_email
