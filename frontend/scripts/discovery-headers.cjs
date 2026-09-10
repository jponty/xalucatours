const path = require("node:path");

// Keep the local preview aligned with the static-site headers in render.yaml.
const LINK = '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </sitemap.xml>; rel="sitemap"; type="application/xml", </docs/agents.md>; rel="describedby"; type="text/markdown"';
const CONTENT_TYPES = {
  "/robots.txt": "text/plain; charset=utf-8",
  "/sitemap.xml": "application/xml; charset=utf-8",
  "/.well-known/api-catalog": "application/linkset+json",
  "/.well-known/ai-catalog.json": "application/json",
  "/.well-known/agent-skills/index.json": "application/json",
  "/.well-known/agent-skills/explore-xaluca-trips/SKILL.md": "text/markdown; charset=utf-8",
  "/docs/agents.md": "text/markdown; charset=utf-8",
};

function discoveryMiddleware(publicDirectory) {
  return (req, res, next) => {
    res.setHeader("Link", LINK);
    if (!["GET", "HEAD"].includes(req.method) || !Object.hasOwn(CONTENT_TYPES, req.path)) return next();
    res.setHeader("Content-Type", CONTENT_TYPES[req.path]);
    if (req.path === "/.well-known/ai-catalog.json") res.setHeader("Access-Control-Allow-Origin", "*");
    // Only these named public resources bypass CRA's dotfile filtering/proxy.
    // Missing files must produce an error, never the SPA's HTML fallback.
    res.sendFile(path.join(publicDirectory, req.path.slice(1)), { dotfiles: "allow" }, (error) => {
      if (error) next(error);
    });
  };
}

module.exports = { LINK, CONTENT_TYPES, discoveryMiddleware };
