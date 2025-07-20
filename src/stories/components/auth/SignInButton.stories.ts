import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import SignInButton from "~/components/auth/SignInButton";

const meta: Meta<typeof SignInButton> = {
  title: "Components/Auth/SignInButton",
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      name: "Loading State",
      description: "Indicates whether the button is in a loading state",
      defaultValue: false,
      control: { type: "boolean" },
    },
  },
  component: SignInButton,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
  },
};

export const Skeleton: Story = {
  args: {
    isLoading: true,
  },
};
