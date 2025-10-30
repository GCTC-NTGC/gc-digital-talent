export function urlMatchesAppHostName(url: string): boolean {
  const pattern = new URLPattern({ hostname: APP_HOST });
  console.log({ url, APP_HOST, pattern, matches: pattern.test(url) });
  return pattern.test(url);
}
