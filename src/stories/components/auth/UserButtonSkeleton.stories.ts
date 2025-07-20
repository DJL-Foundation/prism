import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import UserButton, { UserButtonSkeleton } from "~/components/auth/UserButton";

const meta: Meta<typeof UserButton> = {
  title: "Components/Auth/UserButton",
  component: UserButtonSkeleton,
  subcomponents: { UserButton },
  tags: ["autodocs"],
  argTypes: {
    showName: {
      name: "Show Name",
      description: "Whether to show the user's name in the button",
      defaultValue: false,
      control: { type: "boolean" },
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof UserButtonSkeleton>;

export const SimpleSkeleton: Story = {
  args: {
    showName: false,
  },
};

export const SkeletonWithName: Story = {
  args: {
    showName: true,
  },
};
