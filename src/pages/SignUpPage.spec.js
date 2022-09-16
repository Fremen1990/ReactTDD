import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import SignUpPage from "./SignUpPage";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

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
    it("has email type for email input", () => {
      const input = screen.getByLabelText("E-mail");
      expect(input.type).toBe("email");
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
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", async (req, res, ctx) => {
        requestBody = await req.json();
        counter++;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => {
      counter = 0;
    });

    beforeAll(() => server.listen());

    afterAll(() => server.close());

    let button;

    const setup = () => {
      render(<SignUpPage />);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
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

    it("hides sign up form after succesful sign up request", async () => {
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

    it("hides spinner and enables button after response received", async () => {
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
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(validationError).toBeInTheDocument();
      expect(button).toBeEnabled();
    });
  });
});
