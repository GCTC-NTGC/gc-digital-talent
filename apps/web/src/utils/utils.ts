export function urlMatchesAppHostName(url: string): boolean {
  const pattern = new URLPattern({ hostname: window.location.hostname });
  return pattern.test(url);
}
