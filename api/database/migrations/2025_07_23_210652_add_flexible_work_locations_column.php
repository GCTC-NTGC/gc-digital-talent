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
                                then :teleworkOnly::jsonb
                            when location_preferences ?? 'TELEWORK'
                                and (jsonb_array_length(location_preferences) > 1)
                                then :teleworkHybridRegion::jsonb
                            when (NOT location_preferences ?? 'TELEWORK')
                                and (jsonb_array_length(location_preferences) > 0)
                                then :regionOnly::jsonb
                            else  :base::jsonb
                        end
            SQL,
            [
                'teleworkOnly' => json_encode(['REMOTE']),
                'teleworkHybridRegion' => json_encode(['REMOTE', 'HYBRID', 'ONSITE']),
                'regionOnly' => json_encode(['ONSITE']),
                'base' => json_encode([]),
            ]
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
