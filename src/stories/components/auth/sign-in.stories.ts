import authClient from "#auth/client.mock";
import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import SignIn from "~/components/auth/sign-in";
import { mockSessionData } from "~/stories/session.mock";

const meta: Meta = {
  title: "Components/Auth/SignIn",
  component: SignIn,
};

export default meta;

type Story = StoryObj<typeof SignIn>;

export const Simple: Story = {
  args: {},
  play: async ({ canvas, userEvent, _args }) => {
    const simMalformatedEmail = "userexample.com";
    const simMalformatedPassword = "short";
    const simValidEmail = "user@example.com";
    const simValidPassword = "Password123";

    const emailInput = await canvas.findByPlaceholderText("Type your email");
    const passwordInput = await canvas.findByPlaceholderText(
      "Enter your password",
    );
    const submitButton = await canvas.findByTestId("submit-button");

    authClient.signIn.email.mockImplementation(async (_data) => {
      console.log(`Mocked signIn.email called`);
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 100);
      });
      return {
        redirect: false,
        token: "mocked-token",
        url: undefined,
        user: {
          id: mockSessionData.user.id,
          email: mockSessionData.user.email,
          name: mockSessionData.user.name,
          image: mockSessionData.user.image ?? null,
          emailVerified: mockSessionData.user.emailVerified,
          createdAt: mockSessionData.user.createdAt,
          updatedAt: mockSessionData.user.updatedAt,
        },
      };
    });

    await userEvent.type(emailInput, simValidEmail);
    await userEvent.type(passwordInput, simValidPassword);
    await userEvent.click(submitButton);
    const loadingState = await within(submitButton).findByTestId("spinner");
    await expect(loadingState).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const successState = await within(submitButton).findByTestId("check-icon");
    await expect(successState).toBeInTheDocument();
  },
};
