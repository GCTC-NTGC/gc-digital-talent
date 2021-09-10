<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePoolsTableIdType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        #DB::statement('ALTER TABLE "pools" ALTER COLUMN id TYPE uuid USING id::uuid');
        DB::statement('ALTER TABLE "pools" ALTER COLUMN id SET DATA TYPE UUID USING (uuid_generate_v4());');


        #Schema::table('pools', function (Blueprint $table) {
        #    $table->uuid('id', 50)
        #    ->change();
        #});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('ALTER TABLE "pools" ALTER COLUMN id TYPE BIGINT USING id::BIGINT');
    }
}
