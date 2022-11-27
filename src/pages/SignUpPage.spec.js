import { act, render, screen, waitForElementToBeRemoved } from "../test/setup";
import SignUpPage from "./SignUpPage";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../locale/i18n";
import en from "../locale/en.json";
import pl from "../locale/pl.json";

let requestBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", async (req, res, ctx) => {
    requestBody = await req.json();
    counter++;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe("Sing Up Page", () => {
  describe("Layout", () => {
    beforeEach(() => {
      // eslint-disable-next-line testing-library/no-render-in-setup
      render(<SignUpPage />);
    });
    it("has header", () => {
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      // const input = screen.getByPlaceholderText("username");
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password repeat input", () => {
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let button, usernameInput, emailInput, passwordInput, passwordRepeatInput;

    const setup = () => {
      render(<SignUpPage />);
      usernameInput = screen.getByLabelText("Username");
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(usernameInput, "user1");
      userEvent.type(emailInput, "user1@email.com");
      userEvent.type(passwordInput, "Password1234");
      userEvent.type(passwordRepeatInput, "Password1234");
      button = screen.queryByRole("button", { name: "Sign Up" });
    };

    it("enables the button when password and password repeat fields have same value", () => {
      setup();
      expect(button).toBeEnabled();
    });

    it.skip("(FETCH MOCK) sends username, email and password to backend after clicking the button", async () => {
      setup();
      const mockFn = jest.fn();
      window.fetch = mockFn;
      userEvent.click(button);
      const firstCallOfMockFunction = mockFn.mock.calls[0];
      const body = JSON.parse(firstCallOfMockFunction[1].body);
      expect(body).toEqual({
        username: "user1",
        email: "user1@email.com",
        password: "Password1234",
      });
    });

    it.skip("(AXIOS MOCK) sends username, email and password to backend after clicking the button", async () => {
      setup();
      const mockFn = jest.fn();
      axios.post = mockFn;
      userEvent.click(button);
      const firstCallOfMockFunction = mockFn.mock.calls[0];
      const body = firstCallOfMockFunction[1];
      expect(body).toEqual({
        username: "user1",
        email: "user1@email.com",
        password: "Password1234",
      });
    });

    it("(MSW MOCK) sends username, email and password to backend after clicking the button", async () => {
      setup();
      userEvent.click(button);
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@email.com",
        password: "Password1234",
      });
    });

    it("(MSW MOCK) disables button when there is an ongoing api call", async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });

    it("(MSW MOCK) displays spinner after clicking submit", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
    });

    it("(MSW MOCK) displays account activation notification after successful sign up request", async () => {
      setup();
      const message = "Please check your e-mail to activate your account";
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);
      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it("hides sign up form after successful sign up request", async () => {
      setup();
      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
    });

    it("displays validation message for username", async () => {
      server.use(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: { username: "Username cannot be null" },
            })
          );
        })
      );
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(
        "Username cannot be null"
      );
      expect(validationError).toBeInTheDocument();
    });

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: message },
          })
        );
      });
    };

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `(
      "displays message: '$message' for field: '$field'",
      async ({ field, message }) => {
        server.use(generateValidationError(field, message));
        setup();
        userEvent.click(button);
        const validationError = await screen.findByText(message);
        expect(validationError).toBeInTheDocument();
      }
    );

    it("hides spinner and enables button after response received", async () => {
      const testField = "username";
      const testFieldMessage = "Username cannot be null";
      server.use(generateValidationError(testField, testFieldMessage));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(testFieldMessage);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(validationError).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it("displays mismatch message for password repeat input", () => {
      setup();
      userEvent.type(passwordInput, "Password1234");
      userEvent.type(passwordRepeatInput, "Password1234notMatch");
      const validationError = screen.queryByText("Password mismatch");
      expect(validationError).toBeInTheDocument();
    });

    it("clears validation error after username field is updated", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(
        "Username cannot be null"
      );
      userEvent.type(usernameInput, "user1-updated");
      expect(validationError).not.toBeInTheDocument();
      // expect(
      //   screen.queryByText("Username cannot be null")
      // ).not.toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears validation error after field: '$field' is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        setup();
        userEvent.click(button);
        const validationError = await screen.findByText(message);
        const inputLabel = await screen.getByLabelText(label);
        userEvent.type(inputLabel, "updated-input");
        expect(validationError).not.toBeInTheDocument();
      }
    );
  });

  describe("Internationalization", () => {
    let polishToggle, englishToggle, passwordInput, passwordRepeatInput;

    const setup = () => {
      render(
        <>
          <SignUpPage />
          {/*// solved with custom render*/}
          {/*<LanguageSelector />*/}
        </>
      );

      polishToggle = screen.getByTitle("Polish");
      englishToggle = screen.getByTitle("English");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
    };

    afterEach(() => {
      act(() => {
        i18n.changeLanguage("en");
      });
    });

    it("initially displays all text in English", () => {
      setup();
      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it("displays all text in Polish after changing the language", () => {
      setup();
      userEvent.click(polishToggle);

      expect(
        screen.getByRole("heading", { name: pl.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: pl.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(pl.username)).toBeInTheDocument();
      expect(screen.getByLabelText(pl.email)).toBeInTheDocument();
      expect(screen.getByLabelText(pl.password)).toBeInTheDocument();
      expect(screen.getByLabelText(pl.passwordRepeat)).toBeInTheDocument();
    });

    it("displays all text in English after changing back from Polish", () => {
      setup();
      userEvent.click(polishToggle);
      userEvent.click(englishToggle);

      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it("displays password mismatch validation in Polish", () => {
      setup();
      userEvent.click(polishToggle);
      userEvent.type(passwordInput, "P4ss");
      const validationMessageInPolish = screen.queryByText(
        pl.passwordMismatchValidation
      );
      expect(validationMessageInPolish).toBeInTheDocument();
    });

    it("sends accept language header as en for outgoing request", async () => {
      setup();

      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      const button = screen.getByRole("button", { name: en.signUp });
      const form = screen.queryByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("en");
    });

    it("sends accept language header as pl for outgoing request after selecting that language", async () => {
      setup();

      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      const button = screen.getByRole("button", { name: en.signUp });
      userEvent.click(polishToggle);
      const form = screen.queryByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("pl");
    });
  });
});
