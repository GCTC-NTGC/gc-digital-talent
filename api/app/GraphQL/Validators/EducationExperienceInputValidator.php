<?php

namespace App\GraphQL\Validators;

use App\Enums\DegreeType;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\FellowshipType;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class EducationExperienceInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $licenseOrCertification = $this->arg('educationType') === EducationType::LICENSE_ACCREDITATION->name ||
            $this->arg('educationType') === EducationType::PROFESSIONAL_CERTIFICATION->name;

        return [
            'educationType' => [
                'sometimes',
                'required',
                Rule::in(array_column(EducationType::cases(), 'name')),
            ],
            'degreeType' => [
                'nullable',
                Rule::in(array_column(DegreeType::cases(), 'name')),
                Rule::requiredIf(
                    $this->arg('educationType') === EducationType::DEGREE_DIPLOMA_CERTIFICATE->name
                ),
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::DEGREE_DIPLOMA_CERTIFICATE->name
                ),
            ],
            'otherEducationType' => [
                Rule::requiredIf(
                    $this->arg('educationType') === EducationType::OTHER->name
                ),
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::OTHER->name
                ),
            ],
            'institution' => [
                'sometimes',
                'required',
            ],
            'fellowshipType' => [
                'nullable',
                Rule::in(array_column(FellowshipType::cases(), 'name')),
                Rule::requiredIf(
                    $this->arg('educationType') === EducationType::FELLOWSHIP->name
                ),
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::FELLOWSHIP->name
                ),
            ],
            'otherFellowshipType' => [
                Rule::requiredIf(
                    $this->arg('educationType') === EducationType::FELLOWSHIP->name &&
                    $this->arg('fellowshipType') === FellowshipType::OTHER->name
                ),
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::FELLOWSHIP->name ||
                    $this->arg('fellowshipType') !== FellowshipType::OTHER->name
                ),
            ],
            'areaOfStudy' => [
                Rule::requiredIf(
                    (
                        $this->arg('educationType') === EducationType::DEGREE_DIPLOMA_CERTIFICATE->name &&
                        $this->arg('degreeType') !== DegreeType::HIGH_SCHOOL->name
                    ) ||
                    $this->arg('educationType') === EducationType::INDIVIDUAL_COURSE->name
                ),
                Rule::prohibitedIf(
                    $this->arg('degreeType') === DegreeType::HIGH_SCHOOL->name ||
                    $this->arg('educationType') === EducationType::LICENSE_ACCREDITATION->name ||
                    $this->arg('educationType') === EducationType::PROFESSIONAL_CERTIFICATION->name
                ),
            ],
            'thesisTitle' => [
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::DEGREE_DIPLOMA_CERTIFICATE->name ||
                    $this->arg('degreeType') === DegreeType::HIGH_SCHOOL->name ||
                    $this->arg('degreeType') === DegreeType::COLLEGE_DIPLOMA->name ||
                    $this->arg('degreeType') === DegreeType::BACHELORS_DEGREE->name
                ),
            ],
            'licenseOrAccreditation' => [
                Rule::requiredIf(
                    $this->arg('educationType') === EducationType::LICENSE_ACCREDITATION->name
                ),
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::LICENSE_ACCREDITATION->name
                ),
            ],
            'certification' => [
                Rule::requiredIf(
                    $this->arg('educationType') === EducationType::PROFESSIONAL_CERTIFICATION->name
                ),
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::PROFESSIONAL_CERTIFICATION->name
                ),
            ],
            'courseName' => [
                Rule::requiredIf(
                    $this->arg('educationType') === EducationType::INDIVIDUAL_COURSE->name
                ),
                Rule::prohibitedIf(
                    $this->arg('educationType') !== EducationType::INDIVIDUAL_COURSE->name
                ),
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in([
                    EducationStatus::IN_PROGRESS->name,
                    EducationStatus::SUCCESS->name,
                    EducationStatus::SUCCESS_CREDENTIAL->name,
                    EducationStatus::SUCCESS_NO_CREDENTIAL->name,
                    EducationStatus::DID_NOT_COMPLETE->name,
                ]),
            ],
            'startDate' => [
                'sometimes',
                'nullable',
                'date',
                Rule::requiredIf(
                    $this->arg('status') !== EducationStatus::DID_NOT_COMPLETE->name ||
                    ! $licenseOrCertification
                ),
                Rule::prohibitedIf(
                    $this->arg('status') === EducationStatus::DID_NOT_COMPLETE->name &&
                    $licenseOrCertification
                ),
                Rule::when(
                    $licenseOrCertification && $this->arg('status') === EducationStatus::IN_PROGRESS->name,
                    [
                        'after_or_equal:today',
                    ]
                ),
                Rule::when(
                    ! $licenseOrCertification || $this->arg('status') !== EducationStatus::IN_PROGRESS->name,
                    [
                        'before_or_equal:today',
                    ]
                ),
            ],
            'endDate' => [
                'sometimes',
                'nullable',
                'date',
                'after_or_equal:'.$this->arg('startDate'),
                Rule::requiredIf(
                    $this->arg('status') !== EducationStatus::IN_PROGRESS->name &&
                    ! $licenseOrCertification
                ),
                Rule::prohibitedIf(
                    $this->arg('status') === EducationStatus::IN_PROGRESS->name || (
                        $this->arg('status') === EducationStatus::DID_NOT_COMPLETE->name &&
                        $licenseOrCertification
                    )
                ),
                Rule::when(
                    ! $licenseOrCertification, [
                        'before_or_equal:today',
                    ]
                ),
            ],
            'prospectiveEndDate' => [
                'nullable',
                'date',
                'after_or_equal:today',
                'after_or_equal:'.$this->arg('startDate'),
                Rule::requiredIf(
                    $this->arg('status') === EducationStatus::IN_PROGRESS->name &&
                    ! $licenseOrCertification
                ),
                Rule::prohibitedIf(
                    $this->arg('status') !== EducationStatus::IN_PROGRESS->name
                ),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
