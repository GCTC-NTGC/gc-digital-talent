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
        Schema::create('development_program_interests', function (Blueprint $table) {
            $table->uuid('id')
                ->primary()
                ->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->foreignUuid('development_program_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('community_interest_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['development_program_id', 'community_interest_id']);
            $table->string('participation_status')->nullable();
            $table->date('completion_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('development_program_interests');
    }
};
