import { render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";
import userEvent from "@testing-library/user-event";

describe("Login Page", () => {
  describe("Layout", () => {
    beforeEach(() => {
      // eslint-disable-next-line testing-library/no-render-in-setup
      render(<LoginPage />);
    });
    it("has header", () => {
      const header = screen.queryByRole("heading", { name: "Login" });
      expect(header).toBeInTheDocument();
    });
    it("has email input", () => {
      // const input = screen.getByPlaceholderText("username");
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
    it("has Login button", () => {
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    it("enables the button when email and password inputs are filled", () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.getByRole("button", { name: "Login" });
      expect(button).toBeEnabled();
    });
  });
});
