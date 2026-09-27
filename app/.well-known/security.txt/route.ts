import { socials } from "@/app/data/portfolio";

export const dynamic = "force-static";

const SITE_URL = "https://riskyakbar.my.id";

export function GET() {
  const contact =
    socials.find((social) => social.href.startsWith("mailto:"))?.href ?? "";

  // RFC 9116 requires an expiry; it is refreshed on every deploy.
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);

  const body = [
    `Contact: ${contact}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    `Policy: ${SITE_URL}/security-policy`,
    "Preferred-Languages: en, id",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    "",
    "# Personal portfolio site. Static, no accounts, no database, no visitor data.",
    "# There is no bug bounty and no monetary reward. Reports asking for payment",
    "# will be closed without a reply. Read the policy before testing.",
    "# Please do not run automated scanners or destructive tests against it.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
