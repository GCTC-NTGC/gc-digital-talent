<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('classification_development_program');
        Schema::dropIfExists('development_program_talent_nomination');
        Schema::dropIfExists('development_program_talent_nomination_event');
        Schema::dropIfExists('development_program_interests');

        Schema::table('development_programs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('community_id');
            $table->dropColumn('description_for_nominations');
        });
    }

    /**
     * Reverse the migrations.
     * Recreates the structure only; dropped data is not restored.
     */
    public function down(): void
    {
        Schema::table('development_programs', function (Blueprint $table) {
            $table->jsonb('description_for_nominations')
                ->default(json_encode(['en' => '', 'fr' => '']))
                ->nullable();
            $table->foreignUuid('community_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::create('classification_development_program', function (Blueprint $table) {
            $table->uuid('id')
                ->primary()
                ->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('classification_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('development_program_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['classification_id', 'development_program_id']);
        });

        Schema::create('development_program_talent_nomination', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('development_program_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('talent_nomination_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['development_program_id', 'talent_nomination_id']);
        });

        Schema::create('development_program_talent_nomination_event', function (Blueprint $table) {
            $table->foreignUuid('development_program_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('talent_nomination_event_id')
                ->constrained()
                ->onDelete('cascade');
        });

        Schema::create('development_program_interests', function (Blueprint $table) {
            $table->uuid('id')
                ->primary()
                ->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->foreignUuid('development_program_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('community_interest_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['development_program_id', 'community_interest_id']);
            $table->string('participation_status')->nullable();
            $table->date('completion_date')->nullable();
            $table->foreignUuid('community_development_program_id')
                ->constrained('community_development_program', 'id')
                ->onDelete('cascade');
        });
    }
};
