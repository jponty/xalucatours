# Xaluca Tours: public discovery

Canonical website: https://xalucatravel.com

## Public resources

- [Sitemap](https://xalucatravel.com/sitemap.xml): canonical public pages in Spanish, English and French.
- [API catalog](https://xalucatravel.com/.well-known/api-catalog): documentation and schema of the existing application API.
- [Skills index](https://xalucatravel.com/.well-known/agent-skills/index.json): public trip-discovery guidance, with an integrity digest.
- [AI catalog](https://xalucatravel.com/.well-known/ai-catalog.json): available discovery resources. It does not advertise a remote MCP or A2A service.

## Browser tools

Where WebMCP is supported, `xaluca_search_pages` searches the site's public page
catalogue and returns titles and canonical URLs. It does not access cookies,
form values, saved favourites, administrative tokens or private customer data.
The usual website navigation remains available in browsers without WebMCP.

## Authentication and actions

Public trip pages require no authentication. The application has an internal
administration login; it is not an OAuth/OIDC authorization server and it is not
an agent-registration service. No agent credentials are issued by this website.

An OpenAPI description documents the existing service; it does not grant
permission to call administrative endpoints or submit forms. Enquiries,
newsletter subscriptions, reservations and payments require the traveller's
explicit request and the normal website flow.

## Formats

This document and the published skill are Markdown resources with their own
URLs. They are not Markdown versions of every page. The static Render site does
not currently negotiate HTML/Markdown from the `Accept` header.
