import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import UserButton, { UserButtonSkeleton } from "~/components/auth/UserButton";

const meta: Meta<typeof UserButton> = {
  title: "Components/Auth/UserButton",
  component: UserButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof UserButton>;

const MockData: Story = {
  args: {
    userdata: {
      user: {
        name: "Jack Ruder",
        email: "jack.ruder@example.com",
        image: "https://github.com/jack-ruder.jpg",
        username: "JackatDJL",
        id: "",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        banned: undefined,
      },
      session: {
        id: "",
        token: "",
        userId: "",
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
};

export const Simple: Story = {
  ...MockData,
};
