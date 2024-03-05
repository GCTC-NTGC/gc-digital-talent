<?php

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
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('expected_salary');
        });

        Schema::dropIfExists('classification_user');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->jsonb('expected_salary')->nullable();
        });

        Schema::create('classification_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('user_id')->nullable(false);
            $table->uuid('classification_id')->nullable(false);

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete(true);
            $table->foreign('classification_id')->references('id')->on('classifications');
            $table->unique(['classification_id', 'user_id'], 'classification_user_unique');
        });
        DB::statement('ALTER TABLE classification_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }
};
