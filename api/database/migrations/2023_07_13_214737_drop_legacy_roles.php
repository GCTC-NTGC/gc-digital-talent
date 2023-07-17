<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('legacy_roles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('legacy_roles')->nullable()->default(json_encode(['APPLICANT']));
        });

        $platformAdmin = DB::table('roles')->where('name', 'platform_admin')->value('id');

        $users = DB::table('users')
            ->join('role_user', 'users.id', '=', 'role_user.user_id')
            ->select('users.id', 'role_user.role_id')
            ->get();

        foreach ($users as $user) {
            if ($user->role_id === $platformAdmin) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['legacy_roles' => ['ADMIN', 'APPLICANT']]);
            }
        }
    }
};
