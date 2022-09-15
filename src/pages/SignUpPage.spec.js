import { render, screen } from "@testing-library/react";
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
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          requestBody = await req.json();
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@email.com",
        password: "Password1234",
      });
      server.close();
    });

    it("(MSW MOCK) disables button when there is an ongoing api call", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          counter++;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);
      userEvent.click(button);
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(counter).toBe(1);
      server.close();
    });

    it("(MSW MOCK) displays spinner after clicking submit", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          counter++;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      await expect(screen.queryByRole("status")).not.toBeInTheDocument();
      await userEvent.click(button);
      const spinner = screen.getByRole("status");
      await expect(spinner).toBeInTheDocument();
      server.close();
    });
  });
});
