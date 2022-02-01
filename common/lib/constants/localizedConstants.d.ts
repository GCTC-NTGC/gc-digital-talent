import { MessageDescriptor } from "react-intl";
export declare const salaryRanges: {
    _50_59K: string;
    _60_69K: string;
    _70_79K: string;
    _80_89K: string;
    _90_99K: string;
    _100K_PLUS: string;
};
export declare const getSalaryRange: {
    (salaryId: string | number): string;
    parameters: any;
};
export declare const languages: {
    EN: {
        defaultMessage: string;
        description: string;
    };
    FR: {
        defaultMessage: string;
        description: string;
    };
};
export declare const getLanguage: {
    (languageId: string | number): MessageDescriptor;
    parameters: any;
};
export declare const educationRequirements: {
    hasDiploma: {
        id: string;
        defaultMessage: string;
    };
    doesNotHaveDiploma: {
        id: string;
        defaultMessage: string;
    };
};
export declare const getEducationRequirement: {
    (educationRequirementId: string | number): MessageDescriptor;
    parameters: any;
};
export declare const languageAbilities: {
    ENGLISH: {
        defaultMessage: string;
        description: string;
    };
    FRENCH: {
        defaultMessage: string;
        description: string;
    };
    BILINGUAL: {
        defaultMessage: string;
        description: string;
    };
};
export declare const getLanguageAbility: {
    (languageAbilityId: string | number): MessageDescriptor;
    parameters: any;
};
export declare const workRegions: {
    ATLANTIC: {
        defaultMessage: string;
        description: string;
    };
    BRITISH_COLUMBIA: {
        defaultMessage: string;
        description: string;
    };
    NATIONAL_CAPITAL: {
        defaultMessage: string;
        description: string;
    };
    NORTH: {
        defaultMessage: string;
        description: string;
    };
    ONTARIO: {
        defaultMessage: string;
        description: string;
    };
    PRAIRIE: {
        defaultMessage: string;
        description: string;
    };
    QUEBEC: {
        defaultMessage: string;
        description: string;
    };
    TELEWORK: {
        defaultMessage: string;
        description: string;
    };
};
export declare const getWorkRegion: {
    (workRegionId: string | number): MessageDescriptor;
    parameters: any;
};
export declare const poolCandidateStatuses: {
    AVAILABLE: {
        defaultMessage: string;
        description: string;
    };
    NO_LONGER_INTERESTED: {
        defaultMessage: string;
        description: string;
    };
    PLACED_INDETERMINATE: {
        defaultMessage: string;
        description: string;
    };
    PLACED_TERM: {
        defaultMessage: string;
        description: string;
    };
};
export declare const getPoolCandidateStatus: {
    (poolCandidateStatusId: string | number): MessageDescriptor;
    parameters: any;
};
export declare const poolCandidateSearchStatuses: {
    DONE: {
        defaultMessage: string;
        description: string;
    };
    PENDING: {
        defaultMessage: string;
        description: string;
    };
};
export declare const getPoolCandidateSearchStatus: {
    (poolCandidateSearchStatusId: string | number): MessageDescriptor;
    parameters: any;
};
