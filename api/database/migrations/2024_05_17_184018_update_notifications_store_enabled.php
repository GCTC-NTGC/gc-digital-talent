<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('enabled_email_notifications')->nullable();
            $table->jsonb('enabled_in_app_notifications')->nullable();
        });

        DB::table('users')
            ->update([
                'enabled_email_notifications' => DB::raw(<<<'SQL'
                    to_jsonb(array_remove(array [
                        case when ignored_email_notifications ?? 'APPLICATION_UPDATE' then null else 'APPLICATION_UPDATE' end,
                        case when ignored_email_notifications ?? 'JOB_ALERT' then null else 'JOB_ALERT' end
                    ], null))
                SQL),
                'enabled_in_app_notifications' => DB::raw(<<<'SQL'
                    to_jsonb(array_remove(array [
                        case when ignored_in_app_notifications ?? 'APPLICATION_UPDATE' then null else 'APPLICATION_UPDATE' end,
                        case when ignored_in_app_notifications ?? 'JOB_ALERT' then null else 'JOB_ALERT' end
                    ], null))
              SQL),
            ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('ignored_email_notifications');
            $table->dropColumn('ignored_in_app_notifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('ignored_email_notifications')->nullable();
            $table->jsonb('ignored_in_app_notifications')->nullable();
        });

        DB::table('users')
            ->update([
                'ignored_email_notifications' => DB::raw(<<<'SQL'
                    to_jsonb(array_remove(array [
                        case when enabled_email_notifications ?? 'APPLICATION_UPDATE' then null else 'APPLICATION_UPDATE' end,
                        case when enabled_email_notifications ?? 'JOB_ALERT' then null else 'JOB_ALERT' end
                    ], null))
                SQL),
                'ignored_in_app_notifications' => DB::raw(<<<'SQL'
                    to_jsonb(array_remove(array [
                        case when enabled_in_app_notifications ?? 'APPLICATION_UPDATE' then null else 'APPLICATION_UPDATE' end,
                        case when enabled_in_app_notifications ?? 'JOB_ALERT' then null else 'JOB_ALERT' end
                    ], null))
              SQL),
            ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('enabled_email_notifications');
            $table->dropColumn('enabled_in_app_notifications');
        });
    }
};
