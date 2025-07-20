import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import Header from "~/components/layout/header";
import { mockSessionData } from "~/stories/session.mock";

const meta: Meta<typeof Header> = {
  title: "Components/Layout/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    assumeSignedIn: {
      control: { type: "boolean" },
      description:
        "Assume the user is signed in for the purpose of this story.",
    },
    authData: {
      control: { type: "object" },
      description: "Auth data to pass to the header component.",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const SignedOut: Story = {
  args: {
    assumeSignedIn: false,
    authData: null,
  },
};

export const SignedIn: Story = {
  args: {
    assumeSignedIn: true,
    authData: mockSessionData,
  },
};
