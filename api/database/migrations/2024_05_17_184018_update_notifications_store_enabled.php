<?php

use App\Enums\NotificationFamily;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $notificationFamilies = [
        NotificationFamily::APPLICATION_UPDATE->name,
        NotificationFamily::JOB_ALERT->name,
    ];

    private function invertFamilies(?string $row): string
    {
        $json = json_decode($row ?? '[]');
        $value = [];

        foreach ($json as $family) {
            array_push($value, $family);
        }

        $inverted = array_diff($this->notificationFamilies, $value);

        return json_encode(array_values($inverted));
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('enabled_email_notifications')->nullable();
            $table->jsonb('enabled_in_app_notifications')->nullable();
        });

        $rows = DB::table('users')
            ->select(DB::raw('ignored_email_notifications, ignored_in_app_notifications, id'))
            ->get();

        $rows->each(function ($row) {
            $enabledEmail = $this->invertFamilies($row->ignored_email_notifications);
            $enabledInApp = $this->invertFamilies($row->ignored_in_app_notifications);

            DB::statement(<<<'SQL'
                    UPDATE users
                    SET     enabled_email_notifications = ?,
                            enabled_in_app_notifications = ?
                    WHERE  id = ?;
                SQL,
                [$enabledEmail, $enabledInApp, $row->id]
            );
        });

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

        $rows = DB::table('users')
            ->select(DB::raw('enabled_email_notifications, enabled_in_app_notifications, id'))
            ->get();

        $rows->each(function ($row) {
            $ignoredEmail = $this->invertFamilies($row->enabled_email_notifications);
            $ignoredApp = $this->invertFamilies($row->enabled_in_app_notifications);

            DB::statement(<<<'SQL'
                    UPDATE users
                    SET     ignored_email_notifications = ?,
                            ignored_in_app_notifications = ?
                    WHERE  id = ?;
                SQL,
                [$ignoredEmail, $ignoredApp, $row->id]
            );
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('enabled_email_notifications');
            $table->dropColumn('enabled_in_app_notifications');
        });
    }
};
