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
        // create new department_id column
        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('department_id')->nullable();
            $table->foreign('department_id')->references('id')->on('departments');
        });

        // fill new department_id column based on current team relationships
        DB::update("
            update pools
            set department_id = coalesce(t.department_id, (select id from departments d where name->>'en' = 'Treasury Board Secretariat')) --fallback to TBS if no department
            from (
                -- pool departments through teams relationship
                select
                    p.id pool_id,
                    td.department_id department_id,
                    row_number() over (partition by p.id) choice  -- no 'order by' so which one is first is undefined
                from pools p
                left join teams t on p.team_id = t.id
                left join team_department td on t.id = td.team_id
            ) t
            where t.choice = 1  -- only taking first choice assignment
            and pools.id = t.pool_id
        ");

        // now that it's filled, make non-nullable
        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('department_id')->nullable(false)->change();  // TODO, double-check when upgrading to Laravel 11
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('department_id');
        });
    }
};
