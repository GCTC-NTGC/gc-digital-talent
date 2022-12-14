<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Database\Helpers\ApiEnums;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $users = DB::table('users')->get();
        foreach($users as $user) {
            $languageAbility = $user->language_ability;
            $userId = $user->id;
            // before dropping the field language_ability, execute a data change provided it is non-null
            if ($languageAbility !== null) {

                // only override looking_for_english if it is null
                if ($user->looking_for_english == null) {
                    // play it safe, ENGLISH and BILINGUAL map to true
                    if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_ENGLISH | $languageAbility == ApiEnums::LANGUAGE_ABILITY_BILINGUAL) {
                        DB::statement(
                            <<<SQL
                                UPDATE users
                                SET looking_for_english = true
                                WHERE id = :userId
                            SQL, [
                                'userId' => $userId,
                            ]
                        );
                    }
                    else {
                        DB::statement(
                            <<<SQL
                                UPDATE users
                                SET looking_for_english = false
                                WHERE id = :userId
                            SQL, [
                                'userId' => $userId,
                            ]
                        );
                    }
                }

                // only override looking_for_french if it is null
                if ($user->looking_for_french == null) {
                    // play it safe, FRENCH and BILINGUAL map to true
                    if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_FRENCH | $languageAbility == ApiEnums::LANGUAGE_ABILITY_BILINGUAL) {
                        DB::statement(
                            <<<SQL
                                UPDATE users
                                SET looking_for_french = true
                                WHERE id = :userId
                            SQL, [
                                'userId' => $userId,
                            ]
                        );
                    }
                    else {
                        DB::statement(
                            <<<SQL
                                UPDATE users
                                SET looking_for_french = false
                                WHERE id = :userId
                            SQL, [
                                'userId' => $userId,
                            ]
                        );
                    }
                }

                // only override looking_for_bilingual if it is null
                if ($user->looking_for_bilingual == null) {
                    // only BILINGUAL maps to true
                    if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_BILINGUAL) {
                        DB::statement(
                            <<<SQL
                                UPDATE users
                                SET looking_for_bilingual = true
                                WHERE id = :userId
                            SQL, [
                                'userId' => $userId,
                            ]
                        );
                    }
                    else {
                        DB::statement(
                            <<<SQL
                                UPDATE users
                                SET looking_for_bilingual = false
                                WHERE id = :userId
                            SQL, [
                                'userId' => $userId,
                            ]
                        );
                    }
                }
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('language_ability');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('language_ability')->nullable()->default(null);
        });

        $users = DB::table('users')->get();
        // conditionally assign the best fitting enum to the re-added field to reverse the migration as best as possible
        foreach($users as $user) {
            $lookingForEnglish = $user->looking_for_english;
            $lookingForFrench = $user->looking_for_french;
            $lookingForBilingual = $user->looking_for_bilingual;
            $userId = $user->id;

            // only english case
            if ($lookingForEnglish && !$lookingForFrench && !$lookingForBilingual) {
                DB::statement(
                    <<<SQL
                        UPDATE users
                        SET language_ability = :english
                        WHERE id = :userId
                    SQL, [
                        'english' => ApiEnums::LANGUAGE_ABILITY_ENGLISH,
                        'userId' => $userId,
                    ]
                );
            }

            // only french case
            if (!$lookingForEnglish && $lookingForFrench && !$lookingForBilingual) {
                DB::statement(
                    <<<SQL
                        UPDATE users
                        SET language_ability = :french
                        WHERE id = :userId
                    SQL, [
                        'french' => ApiEnums::LANGUAGE_ABILITY_FRENCH,
                        'userId' => $userId,
                    ]
                );
            }

            // bilingual case just depends on the one field being true
            // or ignore the field if english and french are both true
            if (($lookingForBilingual) | ($lookingForEnglish && $lookingForFrench)) {
                DB::statement(
                    <<<SQL
                        UPDATE users
                        SET language_ability = :bilingual
                        WHERE id = :userId
                    SQL, [
                        'bilingual' => ApiEnums::LANGUAGE_ABILITY_BILINGUAL,
                        'userId' => $userId,
                    ]
                );
            }

            // in all other cases the field stays null, so cases where all fields tested are false/null for instance
        }
    }
};
