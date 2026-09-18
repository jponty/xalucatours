import fs from "fs";
import path from "path";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import postcss from "postcss";
import { parse } from "@babel/parser";
import { Button, buttonVariants } from "@/components/ui/button";

const stylesheet = postcss.parse(fs.readFileSync(path.resolve("src/index.css"), "utf8"));
const radiusRule = stylesheet.nodes.find((node) => node.type === "rule" && node.selectors.includes(".xaluca-button"));

describe("global button radius", () => {
  test("uses a dedicated 30px token without changing the radius of other surfaces", () => {
    const tokens = stylesheet.nodes.find((node) => node.selector === ":root").nodes;
    expect(tokens.find((node) => node.prop === "--xaluca-button-radius").value).toBe("30px");
    expect(tokens.find((node) => node.prop === "--radius").value).toBe("0.125rem");
  });

  test("overrides only border-radius, globally and outside responsive/Tailwind layers", () => {
    expect(radiusRule.parent.type).toBe("root");
    expect(radiusRule.nodes).toHaveLength(1);
    expect(radiusRule.nodes[0]).toMatchObject({
      prop: "border-radius", value: "var(--xaluca-button-radius)", important: true,
    });
    expect(radiusRule.selectors).toEqual([
      "button", 'input[type="button"]', 'input[type="submit"]', 'input[type="reset"]', '[role="button"]', ".xaluca-button",
    ]);
  });

  test("includes enabled/disabled and portalled buttons, but not ordinary links, inputs or cards", () => {
    const surface = document.createElement("div");
    surface.innerHTML = '<button>Send</button><button disabled>Wait</button><a href="/contacto" class="xaluca-button">Contact</a><div role="button">Action</div><input type="submit"><input type="reset"><input type="button"><a href="/viajes">Text link</a><input type="text"><textarea></textarea><article class="rounded-lg">Card</article><img alt="Photo">';
    expect(surface.querySelectorAll(radiusRule.selector)).toHaveLength(7);
    expect(surface.querySelector("article").matches(radiusRule.selector)).toBe(false);
    expect(surface.querySelector("img").matches(radiusRule.selector)).toBe(false);
  });

  test.each(["default", "destructive", "outline", "secondary", "ghost", "link"])("shared %s variant carries the global style for every size", (variant) => {
    for (const size of ["default", "sm", "lg", "icon"]) {
      expect(buttonVariants({ variant, size }).split(" ")).toContain("xaluca-button");
      expect(buttonVariants({ variant, size })).not.toMatch(/\brounded-/);
    }
  });

  test("Button asChild preserves the anchor, destination and other classes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => root.render(<Button asChild className="custom-cta"><a href="/contacto">Contacta</a></Button>));
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

  test("all custom padded/icon link CTAs opt into the shared radius", () => {
    const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? files(file) : /\.(js|jsx)$/.test(file) && !file.includes(".test.") ? [file] : [];
    });
    const missing = [];
    for (const file of files(path.resolve("src"))) {
      const source = fs.readFileSync(file, "utf8");
      const ast = parse(source, { sourceType: "unambiguous", plugins: ["jsx"] });
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        if (node.type === "JSXOpeningElement" && ["a", "Link", "NavLink"].includes(node.name.name)) {
          const className = node.attributes.find((attribute) => attribute.name?.name === "className");
          const classes = className ? source.slice(className.start, className.end) : "";
          const padded = /\bpx-/.test(classes) && /\bpy-/.test(classes);
          const icon = /\bw-(?:\d|\[)/.test(classes) && /\bh-(?:\d|\[)/.test(classes);
          if (/inline-flex/.test(classes) && (padded || icon) && !classes.includes("xaluca-button")) {
            missing.push(`${path.relative(process.cwd(), file)}:${node.loc.start.line}`);
          }
        }
        for (const value of Object.values(node)) {
          if (Array.isArray(value)) value.forEach(visit);
          else if (value && typeof value === "object") visit(value);
        }
      };
      visit(ast);
    }
    expect(missing).toEqual([]);
  });
});
