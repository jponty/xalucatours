# Xaluca Tours auth.md

## Audience and current access

This document is for agents helping travellers discover public Xaluca Tours
itineraries at https://xalucatravel.com. Public pages and the read-only browser
search tool do not require an account, API key or bearer token.

## Registration and credentials

Agent registration is **not available**. There is no public provisioning,
credential-claim or token-issuance endpoint, and no supported agent registration
method. Do not attempt registration requests or invent authentication URLs.

Xaluca Tours does not currently operate an OAuth/OIDC authorization server for
agents or a remote MCP server. No OAuth issuer, authorization server, grant,
scope or MCP transport is advertised by this document.

The internal administration login is for authorised staff only. Do not request,
reuse or expose staff passwords, administrative tokens or customer records.

## Permitted public discovery

- Consult the [public discovery documentation](https://xalucatravel.com/docs/agents.md).
- Follow the [trip-discovery skill](https://xalucatravel.com/.well-known/agent-skills/explore-xaluca-trips/SKILL.md).
- Use the [sitemap](https://xalucatravel.com/sitemap.xml) for canonical public URLs.

Submitting an enquiry or newsletter form is not an agent-registration flow.
Such actions require the traveller's explicit request and the existing website
flow; this document does not authorise submissions, reservations or payments.

This is an access-status document, not an implementation of the Auth.md agent
registration protocol. It will be updated if a real registration service is
introduced in the future.
