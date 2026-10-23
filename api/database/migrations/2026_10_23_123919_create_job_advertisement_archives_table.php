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
        Schema::create('job_advertisement_archives', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->string('type');
            $table->jsonb('html');
            $table->foreignUuid('pool_id')
                ->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_advertisement_archives');
    }
};
