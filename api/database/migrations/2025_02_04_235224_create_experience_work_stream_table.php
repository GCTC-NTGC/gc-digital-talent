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
        Schema::create('experience_work_stream', function (Blueprint $table) {
            $table->uuid('id')
                ->primary()
                ->default(new Expression('public.gen_random_uuid()'));
            $table->foreignUuid('experience_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('work_stream_id')
                ->constrained()
                ->onDelete('cascade');
            $table->unique(['experience_id', 'work_stream_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experience_work_stream');
    }
};
