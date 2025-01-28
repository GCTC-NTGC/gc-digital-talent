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
        Schema::create('development_programs', function (Blueprint $table) {
            $table->uuid('id')
                ->primary()
                ->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->jsonb('name')
                ->default(json_encode(['en' => '', 'fr' => '']))
                ->nullable();
            $table->jsonb('description_for_profile')
                ->default(json_encode(['en' => '', 'fr' => '']))
                ->nullable();
            $table->jsonb('description_for_nominations')
                ->default(json_encode(['en' => '', 'fr' => '']))
                ->nullable();
            $table->foreignUuid('community_id')
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('development_programs');
        Schema::dropIfExists('classification_development_program');
    }
};
