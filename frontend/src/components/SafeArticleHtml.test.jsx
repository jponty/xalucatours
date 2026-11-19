import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SafeArticleHtml from "./SafeArticleHtml";

test("renders editorial HTML without executable elements or attributes", () => {
  const output = renderToStaticMarkup(
    <SafeArticleHtml html={'<h2>Desierto</h2><p onclick="alert(1)">Ruta <strong>sur</strong></p><script>alert(2)</script><a href="javascript:alert(3)">bad</a><a href="https://example.com">good</a><img src="javascript:alert(4)">'} />
  );
  expect(output).toContain("Desierto");
  expect(output).toContain("<strong>sur</strong>");
  expect(output).toContain('href="https://example.com/"');
  expect(output).not.toContain("onclick");
  expect(output).not.toContain("<script");
  expect(output).not.toContain("alert(");
  expect(output).not.toContain("<img");
});

test("keeps comparison tables readable on narrow screens", () => {
  const output = renderToStaticMarkup(
    <SafeArticleHtml html={'<table><thead><tr><th>Destino</th><th>Tiempo</th></tr></thead><tbody><tr><td>Merzouga</td><td>Tres días</td></tr></tbody></table>'} />
  );
  expect(output).toContain('overflow-x-auto');
  expect(output).toContain('<table');
  expect(output).toContain('<th');
  expect(output).toContain('Merzouga');
});

test("shows only privacy-enhanced YouTube embeds", () => {
  const output = renderToStaticMarkup(
    <SafeArticleHtml html={'<div data-youtube-video=""><iframe src="https://www.youtube-nocookie.com/embed/HGx1E_-3shM" onload="alert(1)"></iframe></div><iframe src="https://untrusted.example/embed/123"></iframe>'} />
  );
  expect(output).toContain('https://www.youtube-nocookie.com/embed/HGx1E_-3shM');
  expect(output.match(/<iframe/g)).toHaveLength(1);
  expect(output).not.toContain('onload');
  expect(output).not.toContain('untrusted.example');
});
