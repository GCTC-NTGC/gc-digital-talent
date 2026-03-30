<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // create tables
        // community - development program pivot
        // classification - community development program pivot
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
            $table->jsonb('description_for_nominations')->default(json_encode(['en' => '', 'fr' => '']))->nullable();
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classification_community_development_program');
        Schema::dropIfExists('community_development_program');
    }
};
