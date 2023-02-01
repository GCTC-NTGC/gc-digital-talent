<?php

use App\Models\Team;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // this Team is seeded in TeamSeeder.php, it is essential this team exists BEFORE migrating so the updateOrCreate is run to make sure
        Team::updateOrCreate(
            [
                'name' => 'digital-community-management',
            ],
            [
                'display_name' => [
                    'en' => 'Digital Community Management',
                    'fr' => 'Gestion de la collectivité numérique',
                ],
            ],
        );

        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('team_id')->references('id')->on('teams')->nullable()->default(null);
        });

        $dcmIdQuery = DB::select('SELECT id FROM teams WHERE name = :name', ['name' => 'digital-community-management']);
        $dcmId = $dcmIdQuery[0]->id;

        DB::statement(
            <<<SQL
                UPDATE pools
                    SET team_id = :dcmId
            SQL, [
                'dcmId' => $dcmId,
            ]);

        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('team_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('team_id');
        });
    }
};
