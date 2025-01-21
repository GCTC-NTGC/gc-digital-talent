<?php

namespace App\Traits\Generator;

use PhpOffice\PhpWord\Element\Section;

trait GeneratesDoc
{
    use GeneratesFile;

    /**
     * Adds text accompanied by a strong label
     *
     * @param  Section  $section  The section to add it to
     * @param  string  $label  Label for the text
     * @param  string  $text  The value
     */
    protected function addLabelText(Section $section, string $label, ?string $text)
    {
        $run = $section->addTextRun();
        $run->addText($label.$this->colon());
        if (! is_null($text)) {
            $run->addText($text);
        }
    }
}
