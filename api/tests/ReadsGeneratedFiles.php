<?php

namespace Tests;

use Illuminate\Support\Facades\Storage;

trait ReadsGeneratedFiles
{
    /**
     * Read the text held inside a generated workbook file (worksheet and shared string parts).
     */
    protected function readWorkbookText(string $fileName): string
    {
        $path = Storage::disk('user_generated')->path('test'.DIRECTORY_SEPARATOR.$fileName.'.xlsx');

        $zip = new \ZipArchive();
        $zip->open($path);
        $text = '';
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);
            if (str_contains($name, 'worksheets/') || str_contains($name, 'sharedStrings')) {
                $text .= $zip->getFromName($name);
            }
        }
        $zip->close();

        return $text;
    }
}
