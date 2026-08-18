<?php

namespace App\Traits\Generator;

use App\Enums\CommunityInterestAdditionalDuty;
use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\FinanceChiefRole;
use App\Models\CommunityDevelopmentProgram;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgram;
use App\Models\DevelopmentProgramUser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Lang;

/**
 * Builds the Community Interest sheet shared by the user and nominations excel
 * generators. Relies on GeneratesSharedExcelData for getWorkStreams().
 */
trait GeneratesCommunityInterestSheet
{
    protected array $userIds = [];

    protected array $communityInterestLocaleKeys1 = [
        'id',
        'first_name',
        'last_name',
        'community_interest',
        'job_interest',
        'training_interest',
        'work_streams',
        'additional_info',
    ];

    protected array $communityInterestLocaleKeys2 = [
        'cfo_status',
        'additional_duties',
        'other_roles',
        'other_sdo_position',
        'procurement_sdo_status',
    ];

    /**
     * Generate data for Community Interest sheet
     */
    private function generateCommunityInterestTab(): void
    {
        $userIds = $this->userIds;

        if (empty($userIds)) {
            return;
        }

        $localizedHeadersPart1 = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->communityInterestLocaleKeys1);
        $localizedHeadersPart2 = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->communityInterestLocaleKeys2);

        $communityIds = CommunityInterest::whereAuthorizedToView(['userId' => $this->authenticatedUserId])
            ->whereIn('user_id', $userIds)
            ->isVerifiedGovEmployee()
            ->get('community_id')
            ->pluck('community_id')
            ->unique();

        // fetch development program directly thru CommunityDevelopmentProgram
        $developmentPrograms = DevelopmentProgram::whereHas(
            'communityDevelopmentPrograms',
            function (Builder $query) use ($communityIds) {
                $query->whereIn('community_id', $communityIds);
            })->get();

        $generatedHeaders = [];
        $developmentProgramIds = [];
        foreach ($developmentPrograms as $program) {
            $generatedHeaders[] = $program->name[$this->lang];
            $generatedHeaders[] = $program->name[$this->lang].' - '.Lang::get('headings.linked_experience', [], $this->lang);
            $developmentProgramIds[] = $program->id;
        }

        // Build a map of community_id -> [program_ids] so each row only shows
        // status for programs actually offered in that row's community.
        // Without this, programs completed in Community A would bleed into
        // Community B rows when both communities share some programs.
        $communityProgramIdsMap = [];
        CommunityDevelopmentProgram::whereIn('community_id', $communityIds)
            ->whereIn('development_program_id', $developmentProgramIds)
            ->get(['community_id', 'development_program_id'])
            ->each(function ($cdp) use (&$communityProgramIdsMap) {
                $communityProgramIdsMap[$cdp->community_id][] = $cdp->development_program_id;
            });

        $this->writer->addRow($this->row([
            ...$localizedHeadersPart1,
            ...$generatedHeaders,
            ...$localizedHeadersPart2,
        ]));

        CommunityInterest::whereAuthorizedToView(['userId' => $this->authenticatedUserId])
            ->whereIn('user_id', $userIds)
            ->isVerifiedGovEmployee()
            ->whereIn('community_id', $communityIds)
            ->with([
                'user',
                'community',
                'workStreams',
                'user.developmentProgramUserRecords',
                'user.developmentProgramUserRecords.educationExperience',
            ])
            ->chunk(200, function ($interests) use ($developmentProgramIds, $communityProgramIdsMap) {
                foreach ($interests as $interest) {
                    $this->writer->addRow($this->row(
                        $this->buildCommunityInterestRow($interest, $developmentProgramIds, $communityProgramIdsMap)
                    ));
                }
            });
    }

    /**
     * Build community interest row
     */
    private function buildCommunityInterestRow(CommunityInterest $interest, array $developmentProgramIds, array $communityProgramIdsMap): array
    {
        $communityProgramIds = $communityProgramIdsMap[$interest->community_id] ?? [];
        $workStreams = $this->getWorkStreams($interest);
        $developmentProgramColumns = [];
        foreach ($developmentProgramIds as $programId) {
            if (in_array($programId, $communityProgramIds)) {
                $developmentProgramColumns[] = $this->getDevelopmentProgramInterest($programId, $interest);
                $developmentProgramColumns[] = $this->getDevelopmentProgramLinkedExperience($programId, $interest);
            } else {
                $developmentProgramColumns[] = null;
                $developmentProgramColumns[] = null;
            }
        }

        return [
            $interest->user->id, // user id
            $interest->user->first_name, // first name
            $interest->user->last_name, // last name
            $interest->community->name[$this->lang] ?? '', // community name
            $interest->job_interest ? $this->localize('common.interested') : $this->localize('common.not_interested'), // job interest
            $interest->training_interest ? $this->localize('common.interested') : $this->localize('common.not_interested'), // training interest
            $workStreams, // Work streams: work streams linked to the community interest separated by commas
            $interest->additional_information, // additional information
            ...$developmentProgramColumns, // Generated leadership and development columns (status + linked experience pairs)
            $interest->community->key === 'finance' ? $this->yesOrNo($interest->finance_is_chief) : '', // CFO status
            $this->localizeEnumArray($interest->additional_duties, CommunityInterestAdditionalDuty::class), // additional duties
            $this->localizeEnumArray($interest->finance_other_roles, FinanceChiefRole::class), // other roles
            $interest->finance_other_roles_other, // other SDO position
            $interest->community->key === 'procurement' ? $this->yesOrNo($interest->procurement_is_sdo) : '', // Procurement SDO status
        ];
    }

    /**
     * Get interest in a development program
     */
    private function getDevelopmentProgramInterest(string $programId, CommunityInterest $communityInterest)
    {
        $programInterest = $communityInterest->user->developmentProgramUserRecords->first(function ($record) use ($programId) {
            /** @var DevelopmentProgramUser $record */
            $id = $record->development_program_id;

            return $id === $programId;
        });

        if (is_null($programInterest) || empty($programInterest)) {
            return null;
        }

        /** @var DevelopmentProgramUser $programInterest */
        switch ($programInterest->participation_status) {
            case DevelopmentProgramParticipationStatus::NOT_INTERESTED->name:
                return $this->localize('common.not_interested');
            case DevelopmentProgramParticipationStatus::INTERESTED->name:
                return $this->localize('common.interested_in_program');
            case DevelopmentProgramParticipationStatus::ENROLLED->name:
                return $this->localize('common.currently_enrolled');
            case DevelopmentProgramParticipationStatus::COMPLETED->name:
                return $programInterest->completion_date
                    ? $this->localize('common.completed_in').$programInterest->completion_date->format('F Y')
                    : $this->localize('common.successfully_completed');
        }
    }

    /**
     * Get the linked education experience title for a development program interest
     */
    private function getDevelopmentProgramLinkedExperience(string $programId, CommunityInterest $communityInterest): ?string
    {
        $programInterest = $communityInterest->user->developmentProgramUserRecords->first(function ($record) use ($programId) {
            /** @var DevelopmentProgramUser $record */
            return $record->development_program_id === $programId;
        });

        if (is_null($programInterest)) {
            return null;
        }

        /** @var DevelopmentProgramUser $programInterest */
        return $programInterest->educationExperience?->getTitle($this->lang) ?? null;
    }
}
