import { render, screen } from "@testing-library/react";
import SignUpPage from "./SignUpPage";
import userEvent from "@testing-library/user-event";

describe("Sing Up Page", () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<SignUpPage />);
  });

  describe("Layout", () => {
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
    it("enables the button when password and password repeat fields have same value", () => {
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(passwordInput, "Password1234");
      userEvent.type(passwordRepeatInput, "Password1234");
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeEnabled();
    });
  });
});
