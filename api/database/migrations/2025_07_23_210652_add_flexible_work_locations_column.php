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
            $table->jsonb('flexible_work_locations')->default(json_encode([]));
        });

        DB::statement(
            <<<'SQL'
                UPDATE users
                    SET flexible_work_locations =
                        case
                            when location_preferences ?? 'TELEWORK'
                                and (jsonb_array_length(location_preferences) = 1)
                                then jsonb_build_array('REMOTE')::jsonb
                            when location_preferences ?? 'TELEWORK'
                                and (jsonb_array_length(location_preferences) > 1)
                                then jsonb_build_array('REMOTE', 'HYBRID', 'ONSITE')::jsonb
                            when (NOT location_preferences ?? 'TELEWORK')
                                and (jsonb_array_length(location_preferences) > 0)
                                then jsonb_build_array('ONSITE')::jsonb
                            else  jsonb_build_array()::jsonb
                        end
            SQL,
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('flexible_work_locations');
        });
    }
};
