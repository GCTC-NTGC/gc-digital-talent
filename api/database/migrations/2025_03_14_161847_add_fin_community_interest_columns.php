<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('community_interests', function (Blueprint $table) {
            $table->boolean('finance_is_chief')->nullable();
            $table->jsonb('finance_additional_duties')->default(json_encode([]));
            $table->jsonb('finance_other_roles')->default(json_encode([]));
            $table->string('finance_other_roles_other')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_interests', function (Blueprint $table) {
            $table->dropColumn('finance_is_chief');
            $table->dropColumn('finance_additional_duties');
            $table->dropColumn('finance_other_roles');
            $table->dropColumn('finance_other_roles_other');
        });
    }
};
