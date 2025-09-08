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
        Schema::table('classifications', function (Blueprint $table) {
            $table->boolean('is_available_in_search')->default(false)->nullable(false);
            $table->jsonb('display_name')->default(json_encode(['en' => '', 'fr' => '']))->nullable(false);
        });

        // preconfigure based on apps/web/src/pages/SearchRequests/SearchPage/labels.ts
        DB::update(<<<'SQL'
            update classifications as c
            set
                is_available_in_search = true,
                display_name = jsonb_build_object('en', d.en, 'fr', d.fr),
                updated_at = now()
            from (values
                ('IT', 1, 'Technician', 'Technicien(ne)'),
                ('IT', 2, 'Analyst', 'Analyste'),
                ('IT', 3, 'Technical Advisor or Team Leader', 'Conseiller(ère) technique ou Chef d''équipe'),
                ('IT', 4, 'Senior Advisor or Manager', 'Conseiller(ère) principal(e) ou Gestionnaire'),
                ('IT', 5, 'Director or Senior Strategist', 'Directeur(trice) ou Stratège principal(e)'),
                ('PM', 1, 'Junior Officer', 'Agent(e) subalterne'),
                ('PM', 2, 'Junior Analyst', 'Analyste subalterne'),
                ('PM', 3, 'Officer', 'Agent(e)'),
                ('PM', 4, 'Analyst', 'Analyste'),
                ('PM', 5, 'Senior Analyst', 'Analyste principal(e)'),
                ('PM', 6, 'Manager', 'Gestionnaire'),
                ('CR', 4, 'Clerk', 'Commis'),
                ('EX', 3, 'Digital Leader', 'Chef de file du numérique'),
                ('EX', 4, 'Digital Leader', 'Chef de file du numérique'),
                ('AS', 3, 'Advisor or Analyst', 'Conseiller(ère) ou analyste'),
                ('AS', 5, 'Senior Advisor or Analyst', 'Conseiller(ère) principal(e) ou analyste'),
                ('EC', 2, 'Research Analyst', 'Analyste de recherche'),
                ('EC', 3, 'Analyst', 'Analyste'),
                ('EC', 4, 'Analyst or Economist', 'Analyste ou économiste'),
                ('EC', 5, 'Analyst or Advisor', 'Analyste ou conseiller(ère)'),
                ('EC', 6, 'Advisor or Economist', 'Conseiller(ère) ou économiste'),
                ('EC', 7, 'Senior Advisor', 'Conseiller(ère) principal(e)'),
                ('EC', 8, 'Expert Advisor', 'Expert(e)-conseil')
            ) as d("group", level, en, fr)
            where c."group" = d."group" and c.level = d.level
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classifications', function (Blueprint $table) {
            $table->dropColumn('display_name');
            $table->dropColumn('is_available_in_search');
        });
    }
};
