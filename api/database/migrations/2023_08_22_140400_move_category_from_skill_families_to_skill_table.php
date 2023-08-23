<?php

use App\Models\Skill;
use Database\Helpers\ApiEnums;
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
        Schema::table('skills', function (Blueprint $table) {
            // Create category column in Skill table, temporarily set category to technical
            $table->string('category')
                ->nullable(false)
                ->default(ApiEnums::SKILL_CATEGORY_TECHNICAL);
        });

        // Iterate through all skills and update category using data from skill families
        $skills = Skill::all();
        foreach ($skills as $skill) {
            $category = $skill
                ->families()
                ->firstWhere('category', '=', ApiEnums::SKILL_CATEGORY_TECHNICAL)
                ->category;
            DB::table('skills')
                ->where('id', $skill->id)
                ->update(['category' => $category ? $category : ApiEnums::SKILL_CATEGORY_BEHAVIOURAL]);
        }

        // Drop category column from skill categories
        Schema::table('skill_families', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skill_families', function (Blueprint $table) {
            $table->string('category')
                ->nullable(false)
                ->default(ApiEnums::SKILL_CATEGORY_TECHNICAL);
        });

        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
