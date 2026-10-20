# Debugging

There are many ways to debug the code in this project. This guide contains a couple of different ways to do that.

## PHP running in the webserver container

Debugging PHP in the webserver container allows stepping though Laravel code in your IDE that was launched by a browser request.

1. Open infrastructure/conf/xdebug.ini and set `xdebug.mode=develop,debug`. Restart your web server `docker compose restart webserver`.

2. Start your Xdebug debugging client. For example, launch the "PHP Xdebug webserver (WSL)" profile if you are using VSCode with WSL or "PHP Xdebug webserver (native)" if you are running VSCode with a native Linux environment.

3. Set a code breakpoint. For example, any line in AppServiceProvider::boot should be hit with every API request.

4. Navigate to http://localhost:8000/en/ and observe that the loading is interrupted and the debugger has stopped at your breakpoint.

Troubleshooting:

1. Navigate to http://localhost:8000/xdebuginfo.php and confirm that the Diagnostic Log shows no errors and that Step Debugging shows "Active" with a Connected Client.

## PHP running in the native CLI

Debugging PHP in the native CLI allows stepping though Laravel code running in PHP tests launched locally.

1. Start your Xdebug debugging client. For example, launch the "PHP Xdebug CLI (native)" if you are running VSCode with a native Linux environment.

2. Set a code breakpoint. For example, the line in AuthControllerTest::setUp.

3. In your terminal with the variable, run a test, like `./artisan test tests/Unit/AuthControllerTest.php`. Observe that testing is interrupted and the debugger has stopped at your breakpoint.

Troubleshooting:

1. Run `php -r "xdebug_info();"` and confirm that the Diagnostic Log shows no errors and that Step Debugging shows "Active" with a Connected Client.
