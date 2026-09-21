import {
  CHATBASE_HELP_URL,
  VIRTUAL_ASSISTANT_INFO_EVENT,
  VIRTUAL_ASSISTANT_OPEN_EVENT,
  VIRTUAL_ASSISTANT_PATH,
  launchChatbaseAssistant,
  openChatbaseAssistant,
  openVirtualAssistant,
} from "./chatbase";

const originalLocation = Object.getOwnPropertyDescriptor(window, "location");
let assign;
let openWindow;
let chatbaseOpen;
let openAssistant;
let openInfo;

beforeEach(() => {
  assign = jest.fn();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { pathname: "/contacto", assign },
  });
  openWindow = jest.spyOn(window, "open").mockImplementation(() => null);
  chatbaseOpen = jest.fn();
  window.chatbase = { open: chatbaseOpen };
  openAssistant = jest.fn();
  openInfo = jest.fn();
  window.addEventListener(VIRTUAL_ASSISTANT_OPEN_EVENT, openAssistant);
  window.addEventListener(VIRTUAL_ASSISTANT_INFO_EVENT, openInfo);
});

afterEach(() => {
  window.removeEventListener(VIRTUAL_ASSISTANT_OPEN_EVENT, openAssistant);
  window.removeEventListener(VIRTUAL_ASSISTANT_INFO_EVENT, openInfo);
  Object.defineProperty(window, "location", originalLocation);
  delete window.chatbase;
  openWindow.mockRestore();
});

test.each([
  ["current helper", openVirtualAssistant],
  ["legacy click handler", openChatbaseAssistant],
  ["legacy launch handler", launchChatbaseAssistant],
])("%s navigates to the internal page in the current tab, even if Chatbase is loaded", (_, open) => {
  const event = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
  open(event);

  expect(VIRTUAL_ASSISTANT_PATH).toBe("/asistente");
  expect(assign).toHaveBeenCalledWith("/asistente");
  expect(event.preventDefault).toHaveBeenCalledTimes(1);
  expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  expect(openWindow).not.toHaveBeenCalled();
  expect(chatbaseOpen).not.toHaveBeenCalled();
  expect(openAssistant).not.toHaveBeenCalled();
  expect(openInfo).not.toHaveBeenCalled();
});

test.each(["/asistente", "/asistente/"])("reopens the local widget on %s without navigating or showing the old modal", (pathname) => {
  window.location.pathname = pathname;
  openChatbaseAssistant();
  launchChatbaseAssistant();

  expect(openAssistant).toHaveBeenCalledTimes(2);
  expect(assign).not.toHaveBeenCalled();
  expect(openInfo).not.toHaveBeenCalled();
  expect(openWindow).not.toHaveBeenCalled();
  expect(chatbaseOpen).not.toHaveBeenCalled();
});

test("the legacy help destination also stays inside the site", () => {
  expect(CHATBASE_HELP_URL).toBe(VIRTUAL_ASSISTANT_PATH);
});
