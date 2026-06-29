<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // create tables
        // community - development program pivot
        // classification - community development program pivot
        // nullable community on development_programs
        Schema::create('community_development_program', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->foreignUuid('community_id')
                ->constrained('communities', 'id')
                ->onDelete('cascade');
            $table->foreignUuid('development_program_id')
                ->constrained('development_programs', 'id')
                ->onDelete('cascade');
            $table->unique(['community_id', 'development_program_id']);
        });
        Schema::create('classification_community_development_program', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->foreignUuid('classification_id')
                ->constrained('classifications', 'id')
                ->onDelete('cascade');
            $table->foreignUuid('community_development_program_id')
                ->constrained('community_development_program', 'id')
                ->onDelete('cascade');
            $table->unique(['classification_id', 'community_development_program_id'], 'classification_community_development_program_unique');
        });
        Schema::table('development_programs', function (Blueprint $table) {
            $table->foreignUuid('community_id')
                ->nullable(true)
                ->change();
        });

        // fill in table community_development_program
        $developmentPrograms = DB::table('development_programs')->get();
        foreach ($developmentPrograms as $developmentProgram) {
            DB::table('community_development_program')->insert([
                'community_id' => $developmentProgram->community_id,
                'development_program_id' => $developmentProgram->id,
            ]);
        }

        // fill in table classification_community_development_program
        // done second so as to reference the above
        $classificationDevelopmentPrograms = DB::table('classification_development_program')->get();
        $communityDevelopmentPrograms = DB::table('community_development_program')->get();
        foreach ($classificationDevelopmentPrograms as $classificationDevelopmentProgram) {
            $relevantCommunityDevelopmentProgramId = $communityDevelopmentPrograms
                ->where('development_program_id', $classificationDevelopmentProgram->development_program_id)
                ->sole()
                ->id;

            DB::table('classification_community_development_program')->insert([
                'classification_id' => $classificationDevelopmentProgram->classification_id,
                'community_development_program_id' => $relevantCommunityDevelopmentProgramId,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('development_programs', function (Blueprint $table) {
            $table->foreignUuid('community_id')
                ->nullable(false)
                ->change();
        });
        Schema::dropIfExists('classification_community_development_program');
        Schema::dropIfExists('community_development_program');
    }
};
