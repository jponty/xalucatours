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
