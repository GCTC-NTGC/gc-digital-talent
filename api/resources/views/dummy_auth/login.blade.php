<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>GC Digital Talent Test Sign In</title>
  <style>
    :root {
      --rounded: 0.375rem;
      --black: 30, 30, 35;
      --primary: 0, 195, 183;
      --focus: 100, 146, 255;
      --space: 0.625rem 1.3rem;
    }

    body {
      background-color: rgba(245, 248, 253, 1);
      font-family: "Open sans", sans-serif;
      font-size: 100%;
      display: grid;
      width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }

    body>div {
      place-self: center;
    }

    h1 {
      font-size: clamp(1.25rem, 2vw + 1rem, 2rem);
      margin: 2rem 0 1rem 0;
      text-align: center;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      row-gap: 0.25rem;
    }

    input,
    textarea {
      border-radius: 0.375rem;
      border: thin solid rgba(var(--black), 1);
      font-family: inherit;
      padding: 0.75rem;
    }

    input:focus-visible,
    textarea:focus-visible {
      border-color: rgba(var(--focus), 1);
      outline: 2px solid rgba(var(--focus), 1);
      outline-offset: 2px;
    }

    label {
      font-size: 0.8rem;
    }

    label>span {
      color: rgba(185, 6, 36, 1);
      vertical-align: super;
    }

    button {
      background-color: rgba(var(--primary), 1);
      border: 3px solid rgba(var(--primary), 1);
      border-radius: 0.375rem;
      color: rgba(var(--black), 1);
      cursor: pointer;
      font-weight: 700;
      padding: var(--space);
      transition: background-color 200ms ease;
    }

    button:hover {
      background-color: rgb(191, 245, 241);
    }

    form {
      background-color: rgba(255, 255, 255, 1);
      border-radius: var(--rounded);
      box-shadow: rgba(0, 0, 0, 0.2) 0px 8.8px 16px -3.2px;
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      padding: 1.75rem;
      max-width: clamp(calc(100% - 1rem), 60vw, 40rem);
      margin: 0 auto;
    }

    .link-button {
      align-self: flex-start;
      background: none;
      border: none;
      color: rgba(var(--black), 1);
      font-size: 0.8rem;
      font-weight: 400;
      padding: 0;
      text-decoration: underline;
    }

    .link-button:hover {
      background: none;
      text-decoration: none;
    }

    .warning {
      background-color: rgba(255, 233, 160, 1);
      border: 3px solid rgba(185, 120, 0, 1);
      border-radius: var(--rounded);
      font-size: 0.9rem;
      margin: 0;
      padding: 0.75rem;
    }

    .error {
      color: rgba(185, 6, 36, 1);
      font-size: 0.8rem;
      margin: 0;
    }

    .link-button:focus-visible {
      outline: 2px solid rgba(var(--focus), 1);
      outline-offset: 2px;
    }
  </style>
</head>

<body>

  <div>
    <h1>GC Digital Talent test sign in</h1>
    <form method="post" action="auth-callback">
      @csrf
      <p class="warning" role="alert">
        <strong>Test authentication.</strong> This environment does not use a real sign-in service.
        Anyone can sign in as any user. Do not enter real personal information.
      </p>
      <div class="form-group">
        <label for="sub">Sub<span>*</span></label>
        <input type="text" name="sub" id="sub" autofocus="on" placeholder="Enter any user/subject" value="{{ old('sub') }}" required>
        @error('sub')
          <p class="error">{{ $message }}</p>
        @enderror
      </div>
      <div class="form-group">
        <label for="claims">Claims</label>
        <textarea name="claims" id="claims" rows="8" placeholder="Optional claims JSON value, example:
{
  &quot;given_name&quot;: &quot;Test&quot;
}">{{ old('claims') }}</textarea>
        @error('claims')
          <p class="error">{{ $message }}</p>
        @enderror
        <button type="button" class="link-button" id="standard-claims">
          Standard CanadaLogin claims
        </button>
      </div>
      <button type="submit">Sign in</button>
    </form>
  </div>
  <script>
    document
      .getElementById("standard-claims")
      .addEventListener("click", function () {
        var claims = document.getElementById("claims");
        claims.value = JSON.stringify(
          {
            given_name: "Test",
            family_name: "User",
            email: "test.user@example.org",
            phone_number: "+12345678910",
            locale: "en",
          },
          null,
          2,
        );
        claims.focus();
      });
  </script>
</body>

</html>
