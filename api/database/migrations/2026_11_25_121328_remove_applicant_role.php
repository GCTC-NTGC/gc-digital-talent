<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $baseUserId = DB::table('roles')->where('name', 'base_user')->value('id');
        $applicantId = DB::table('roles')->where('name', 'applicant')->value('id');

        $existingBaseUsers = DB::table('role_user')
            ->where('role_id', $baseUserId)
            ->select('user_id');

        DB::table('role_user')
            ->where('role_id', $applicantId)
            ->whereIn('user_id', $existingBaseUsers)
            ->delete();

        DB::table('role_user')
            ->where('role_id', $applicantId)
            ->update(['role_id' => $baseUserId]);

        DB::table('roles')->where('name', 'applicant')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
