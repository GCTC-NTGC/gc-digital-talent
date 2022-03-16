<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Put your description here.">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/images/apple-touch-icon.png') }}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('/images/favicon-32x32.png') }}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('/images/favicon-16x16.png') }}">
  <link rel="manifest" href="{{ asset('/site.webmanifest') }}">
  <link href="{{ asset(mix('/css/hydrogen.css')) }}" rel="stylesheet" type="text/css"/>
  <link href="{{ asset(mix('/css/common.css')) }}" rel="stylesheet" type="text/css"/>
  <link href="{{ asset(mix('/css/app.css')) }}" rel="stylesheet" type="text/css"/>
  <title>{{ config('app.name') }}</title>
</head>
<body>
  <div id="app" data-h2-font-family="b(sans)"></div>
  <script type='text/javascript'>
@php
$data = [
    "OAUTH_LOGOUT_URI" => $_ENV["OAUTH_LOGOUT_URI"],
    "OAUTH_POST_LOGOUT_REDIRECT" => $_ENV["OAUTH_POST_LOGOUT_REDIRECT"],
];
$json = json_encode($data);
echo "window.__SERVER_CONFIG__ = $json;";
@endphp
  </script>
  <script>window.__TEST = "hello"</script>
  <script src="{{ asset(mix('/js/dashboard.js')) }}"></script>
</body>
</html>
