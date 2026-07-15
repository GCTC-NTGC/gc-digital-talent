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
        Schema::create('classification_talent_nomination_group_advancement', function (Blueprint $table) {
            $table->uuid('id')
                ->primary()
                ->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->foreignUuid('classification_id')
                ->constrained();
            $table->foreignUuid('talent_nomination_group_id')
                ->constrained();
            $table->unique(['classification_id', 'talent_nomination_group_id'], 'classification_nomination_group_advancement_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classification_talent_nomination_group_advancement');
    }
};
