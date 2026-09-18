import React, { act } from "react";
import { createRoot } from "react-dom/client";
import fs from "fs";
import path from "path";
import postcss from "postcss";
import { Button, buttonVariants } from "@/components/ui/button";

const stylesheet = postcss.parse(fs.readFileSync(path.resolve("src/index.css"), "utf8"));
const radiusRule = stylesheet.nodes.find((node) => node.type === "rule" && node.selectors.includes(".xaluca-button"));

describe("CTA-only button radius", () => {
  test("uses a dedicated 30px token without changing the radius of other surfaces", () => {
    const tokens = stylesheet.nodes.find((node) => node.selector === ":root").nodes;
    expect(tokens.find((node) => node.prop === "--xaluca-button-radius").value).toBe("30px");
    expect(tokens.find((node) => node.prop === "--radius").value).toBe("0.125rem");
  });

  test("targets explicit CTAs and submit controls only", () => {
    expect(radiusRule.parent.type).toBe("root");
    expect(radiusRule.nodes).toHaveLength(1);
    expect(radiusRule.nodes[0]).toMatchObject({
      prop: "border-radius", value: "var(--xaluca-button-radius)", important: true,
    });
    expect(radiusRule.selectors).toEqual([
      'button[type="submit"]', 'input[type="submit"]', ".xaluca-button",
    ]);
  });

  test("does not alter generic controls, tabs, cards, images or ordinary links", () => {
    const surface = document.createElement("div");
    surface.innerHTML = '<button type="button">Tab</button><button role="tab">Month</button><a href="/contacto" class="xaluca-button">Contact</a><div role="button">Card</div><button type="submit">Send</button><input type="submit"><input type="reset"><input type="button"><a href="/viajes">Text link</a><article class="rounded-lg">Card</article><img alt="Photo">';
    expect(surface.querySelectorAll(radiusRule.selector)).toHaveLength(3);
    for (const selector of ['button[type="button"]', '[role="tab"]', '[role="button"]', 'input[type="reset"]', 'input[type="button"]', 'a:not(.xaluca-button)', "article", "img"]) {
      expect(surface.querySelector(selector).matches(radiusRule.selector)).toBe(false);
    }
  });

  test.each(["default", "destructive", "outline", "secondary", "ghost", "link"])("shared %s control preserves its original component radius", (variant) => {
    for (const size of ["default", "sm", "lg", "icon"]) {
      expect(buttonVariants({ variant, size }).split(" ")).not.toContain("xaluca-button");
      expect(buttonVariants({ variant, size })).toMatch(/\brounded-md\b/);
    }
  });

  test("Button asChild opts into the CTA radius only when requested", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(<Button asChild className="xaluca-button custom-cta"><a href="/contacto">Contacta</a></Button>));
      const link = container.querySelector("a");
      expect(link.getAttribute("href")).toBe("/contacto");
      expect(link.classList.contains("custom-cta")).toBe(true);
      expect(link.classList.contains("xaluca-button")).toBe(true);
      expect(container.querySelector("button")).toBeNull();
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });

});
