import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import fs from "fs";
import path from "path";
import PersonalNameFields, { personalNameFields, hasPersonalName } from "./PersonalNameFields";

jest.mock("@/contexts/LanguageContext", () => ({ pick: (obj, lang) => obj[lang] || obj.es }));
let root, container;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); delete global.IS_REACT_ACT_ENVIRONMENT; });
function Form(props) {
  const [value, setValue] = useState({ first_name: "", last_name: "" });
  return <form><PersonalNameFields {...props} value={value} onChange={(key, text) => setValue(v => ({ ...v, [key]: text }))} /></form>;
}
const render = props => act(() => root.render(<Form {...props} />));

test.each([["es", "Nombre", "Apellido(s)"], ["en", "First name", "Last name(s)"], ["fr", "Prénom", "Nom de famille"]])("%s has two labelled, independently editable and required inputs", (lang, firstLabel, lastLabel) => {
  render({ lang });
  const inputs = container.querySelectorAll("input");
  expect(inputs).toHaveLength(2);
  expect(inputs[0].name).toBe("first_name"); expect(inputs[1].name).toBe("last_name");
  expect(inputs[0].autocomplete).toBe("given-name"); expect(inputs[1].autocomplete).toBe("family-name");
  expect(inputs[0].maxLength).toBe(120); expect(inputs[1].maxLength).toBe(150);
  [firstLabel, lastLabel].forEach((label, index) => {
    expect(container.querySelector(`label[for="${inputs[index].id}"]`).textContent).toBe(`${label} *`);
    expect(inputs[index].required).toBe(true);
  });
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(inputs[0], "María José");
    inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(inputs[0].value).toBe("María José"); expect(inputs[1].value).toBe("");
});

test("optional feedback fields stay optional and name errors remain accessible", () => {
  render({ required: false, errors: { last_name: "Revisa tus apellidos" } });
  expect([...container.querySelectorAll("input")].every(el => !el.required)).toBe(true);
  expect(container.textContent).toContain("Apellido(s) (opcional)");
  const surname = container.querySelector('[name="last_name"]');
  expect(surname.getAttribute("aria-invalid")).toBe("true");
  expect(document.getElementById(surname.getAttribute("aria-describedby")).textContent).toBe("Revisa tus apellidos");
});

test("normalization preserves compound names and never parses an old full name", () => {
  expect(personalNameFields({ first_name: "  María   José ", last_name: " de la Cruz  O’Neill ", full_name: "Stale" }))
    .toEqual({ first_name: "María José", last_name: "de la Cruz O’Neill" });
  expect(hasPersonalName({ full_name: "Ana García" })).toBe(false);
  expect(hasPersonalName({ first_name: "Ana", last_name: "  " })).toBe(false);
});

test("every previously combined identity form uses the shared split fields", () => {
  for (const file of ["components/ContactForm.jsx", "components/PlannerForm.jsx", "components/DictationForm.jsx",
    "components/VirtualAssistantWidget.jsx", "pages/FastTrackPage.jsx", "pages/FeedbackPage.jsx"]) {
    const code = fs.readFileSync(path.resolve("src", file), "utf8");
    expect(code).toContain("<PersonalNameFields");
    expect(code).toContain("personalNameFields(");
    expect(code).not.toMatch(/full_name|fullName|Nombre completo|Full name|Nom complet/);
  }
});
