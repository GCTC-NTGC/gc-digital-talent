<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('CREATE INDEX accepted_operational_requirements_gin ON users USING GIN (accepted_operational_requirements)');
        DB::statement('CREATE INDEX flexible_work_locations_gin ON users USING GIN (flexible_work_locations)');
        DB::statement('CREATE INDEX location_preferences_gin ON users USING GIN (location_preferences)');
        DB::statement('CREATE INDEX position_duration_gin ON users USING GIN (position_duration)');
        DB::statement('CREATE INDEX indigenous_communities_gin ON users USING GIN (indigenous_communities)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS accepted_operational_requirements_gin');
        DB::statement('DROP INDEX IF EXISTS flexible_work_locations_gin');
        DB::statement('DROP INDEX IF EXISTS location_preferences_gin');
        DB::statement('DROP INDEX IF EXISTS position_duration_gin');
        DB::statement('DROP INDEX IF EXISTS indigenous_communities_gin');
    }
};
