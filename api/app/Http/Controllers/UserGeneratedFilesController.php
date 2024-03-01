<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserGeneratedFilesController extends Controller
{
    /*
    curl http://localhost:8000/api/user-generated-files/Synthesis_NASA_data_Vis_720p_YouTube.mp4  \
     -O \
     -H "Authorization: Bearer {accessToken}"
   */

    public function getFile(string $fileName)
    {
        // https://laravel.com/docs/10.x/authentication#accessing-specific-guard-instances
        $userId = Auth::guard('api')->id();
        throw_unless(is_string($userId), UnauthorizedHttpException::class);

        $filePath = $userId.'/'.$fileName;
        throw_unless(Storage::disk('userGenerated')->exists($filePath), NotFoundHttpException::class);

        switch (strtolower(pathinfo($filePath)['extension'])) {
            case 'jpg':
                $contentType = ['Content-Type' => 'image/jpeg'];
                break;
            case 'mp4':
                $contentType = ['Content-Type' => 'video/mpeg'];
                break;
        }

        /* unbuffered response */
        // return response()->streamDownload(function () use ($filePath) {
        //     echo Storage::disk('userGenerated')->get($filePath);
        // }, $fileName, $contentType);

        /* buffered response */
        return response()->streamDownload(function () use ($filePath) {
            $handle = Storage::disk('userGenerated')->readStream($filePath);
            while (! feof($handle)) {
                $buffer = fread($handle, 4096);
                if (! is_bool($buffer)) {
                    echo $buffer;
                }
            }
            fclose($handle);
        }, $fileName, $contentType);

    }
}
