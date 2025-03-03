<?php

namespace App\Enums;

use GraphQL\Type\Definition\Description;

enum TalentNominationStep
{
    #[Description(description: 'Introductory paragraphs.')]
    case INSTRUCTIONS;
    #[Description(description: 'Form to collect information about the submitter and the nominator.')]
    case NOMINATOR_INFORMATION;
    #[Description(description: 'Form to collect information about the nominee.')]
    case NOMINEE_INFORMATION;
    #[Description(description: 'Form to collect details of what the person is being nominated for.')]
    case NOMINATION_DETAILS;
    #[Description(description: 'Form to collect why the candidate is being nominated.')]
    case RATIONALE;
    #[Description(description: 'Page to review and submit the nomination.')]
    case REVIEW_AND_SUBMIT;

}
