<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('career_planning_organization_type_interest');
            $table->dropColumn('career_planning_move_interest');

            $table->boolean('career_planning_lateral_move_interest')->nullable();
            $table->string('career_planning_lateral_move_time_frame')->nullable();
            $table->jsonb('career_planning_lateral_move_organization_type')->nullable();

            $table->boolean('career_planning_promotion_move_interest')->nullable();
            $table->string('career_planning_promotion_move_time_frame')->nullable();
            $table->jsonb('career_planning_promotion_move_organization_type')->nullable();
        });
    }

    /**
     * Reverse the migrations
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('career_planning_lateral_move_interest');
            $table->dropColumn('career_planning_lateral_move_time_frame');
            $table->dropColumn('career_planning_lateral_move_organization_type');

            $table->dropColumn('career_planning_promotion_move_interest');
            $table->dropColumn('career_planning_promotion_move_time_frame');
            $table->dropColumn('career_planning_promotion_move_organization_type');

            $table->jsonb('career_planning_organization_type_interest')->nullable();
            $table->jsonb('career_planning_move_interest')->nullable();
        });
    }
};
