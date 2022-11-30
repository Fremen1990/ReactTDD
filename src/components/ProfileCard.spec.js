import { render, screen } from "../test/setup";
import ProfileCard from "./ProfileCard";
import storage from "../state/storage";
import userEvent from "@testing-library/user-event";

describe("Profile Card", () => {
  const setup = (user = { id: 5, username: "user5" }) => {
    storage.setItem("auth", { id: 5, username: "user5" });
    render(<ProfileCard user={user} />);
  };

  it("displays edit button when logged in user is shown on card", () => {
    setup();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("does not displays edit button for another user", () => {
    setup({ id: 2, username: "user2" });
    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument();
  });

  it("displays input for username after clicking edit button", () => {
    setup();
    expect(
      screen.queryByLabelText("Change your username")
    ).not.toBeInTheDocument();
    userEvent.click(screen.queryByRole("button", { name: "Edit" }));
    expect(screen.queryByLabelText("Change your username")).toBeInTheDocument();
  });

  it("displays save and cancel buttons in edit mode", () => {
    setup();
    userEvent.click(screen.queryByRole("button", { name: "Edit" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("hides edit button and username header in edit mode", () => {
    setup();
    userEvent.click(screen.queryByRole("button", { name: "Edit" }));
    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "user5" })
    ).not.toBeInTheDocument();
  });

  it("has the current username in input", () => {
    setup();
    userEvent.click(screen.queryByRole("button", { name: "Edit" }));
    const input = screen.queryByLabelText("Change your username");
    expect(input.value).toBe("user5");
    expect(input).toHaveValue("user5");
  });
});
