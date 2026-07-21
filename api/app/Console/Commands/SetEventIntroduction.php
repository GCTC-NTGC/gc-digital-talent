<?php

namespace App\Console\Commands;

use App\Models\TalentNominationEvent;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

// This temporary command should be used to set up the OCG events when the code in this PR is deployed and can be removed afterwards.

#[Signature('event:set-ocg-introduction {eventId}')]
#[Description('Sets the introduction text for a talent nomination to the OCG preferred copy.')]
class SetEventIntroduction extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $eventId = $this->argument('eventId');
        $event = TalentNominationEvent::find($eventId);

        if (is_null($event)) {
            $this->error('Talent nomination event not found.');

            return Command::FAILURE;
        }

        if ($this->confirm('Do you wish to update '.$event->name['en'].'?')) {
            $event->custom_instructions = [
                'en' => 'Nominations must be sponsored by a C-suite level executive working in the candidate’s domain and will be triaged by the associated functional community team. Once confirmed, the candidate will be entered in that community’s talent management system for the current year.',
                'fr' => "Les mises en candidature doivent être parrainées par un cadre dirigeant travaillant dans le domaine de la personne candidate et seront triées par l'équipe de la collectivité fonctionnelle associée. Une fois la mise en candidature confirmée, la personne candidate sera inscrit dans le système de gestion des talents de cette collectivité pour l'année en cours.",
            ];
            $event->save();
            $this->info('Event updated.');

        } else {
            $this->info('No updates made.');
        }

    }
}
