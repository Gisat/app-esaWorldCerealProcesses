export function getRequireSessionId(): boolean {
  const oidcMode = process.env.OIDC_MODE || "user";
  return oidcMode === "user";
}