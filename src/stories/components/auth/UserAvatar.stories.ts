import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import UserAvatar from "~/components/auth/UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Components/Auth/UserAvatar",
  tags: ["autodocs"],
  argTypes: {
    src: {
      name: "User Avatar",
      description: "URL of the user avatar image",
      control: { type: "text" },
    },
    name: {
      name: "User Name",
      description: "Name of the user",
      defaultValue: "Unknown User",
      control: { type: "text" },
    },
    tooltip: {
      name: "Tooltip",
      description:
        "Whether to show a tooltip with the user's name as a way to identify the user",
      defaultValue: false,
      control: { type: "boolean" },
    },
  },
  component: UserAvatar,
};

export default meta;

type Story = StoryObj<typeof UserAvatar>;

export const Simple: Story = {
  args: {
    src: "https://github.com/jackatdjl.png",
    name: "JackatDJL",
    tooltip: false,
  },
};

export const NoAvatar: Story = {
  args: {
    src: "",
    name: "No Avatar",
    tooltip: false,
  },
};

export const Tooltip: Story = {
  name: "With Tooltip",
  args: {
    src: "https://github.com/jackatdjl.png",
    name: "JackatDJL",
    tooltip: true,
  },
};
