import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import SignIn from "~/components/auth/sign-in";

const meta: Meta = {
  title: "Components/Auth/SignIn",
  component: SignIn,
};

export default meta;

type Story = StoryObj<typeof SignIn>;

export const Simple: Story = {
  args: {},
};
