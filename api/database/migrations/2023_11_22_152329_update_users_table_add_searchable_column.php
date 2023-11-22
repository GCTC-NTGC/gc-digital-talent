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
        Schema::table('Users', function (Blueprint $table) {
            // Add the searchable column of type tsvector
            $table->tsvector('searchable')->nullable();
        });

        // Update the tsvector column with the data for existing rows

        \DB::statement('UPDATE users SET searchable = to_tsvector(\'english\',
        coalesce(email, \'\') || \' \' || coalesce(first_name, \'\') || \' \' ||
        coalesce(last_name, \'\') || \' \' ||
        coalesce(telephone, \'\') || \' \' ||
        coalesce(preferred_lang, \'\') || \' \' ||
        coalesce(current_province, \'\') || \' \' ||
        coalesce(current_city, \'\') || \' \' ||
        coalesce(comprehension_level, \'\') || \' \' ||
        coalesce(written_level, \'\') || \' \' ||
        coalesce(verbal_level, \'\') || \' \' ||
        coalesce(estimated_language_ability, \'\') || \' \' ||
        coalesce(location_exemptions, \'\') || \' \' ||
        coalesce(priority_number, \'\')
        )
        ');

        // Create a GIN index on the tsvector column for efficient full-text search
        \DB::statement('CREATE INDEX users_searchable_index ON users USING GIN(searchable)');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $table->dropColumn('searchable');

    }
};
