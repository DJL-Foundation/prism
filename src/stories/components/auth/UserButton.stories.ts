import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import UserButton, { UserButtonSkeleton } from "~/components/auth/UserButton";
import { mockSessionData } from "~/stories/session.mock";

const meta: Meta<typeof UserButton> = {
  title: "Components/Auth/UserButton",
  component: UserButton,
  subcomponents: { UserButtonSkeleton },
  tags: ["autodocs"],
  argTypes: {
    userdata: {
      name: "User Data",
      description: "Data of the user to be displayed in the button",
      control: { type: "object" },
    },
    showName: {
      name: "Show Name",
      description: "Whether to show the user's name in the button",
      defaultValue: false,
      control: { type: "boolean" },
    },
    modify: {
      name: "Modify",
      description: "Additional modifications to the button behavior",
      control: { type: "object" },
      table: {
        type: { summary: "{ forceOpenState?: boolean }" },
        defaultValue: { summary: "{}" },
      },
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof UserButton>;

const MockData: Story = {
  args: {
    userdata: mockSessionData,
    showName: false,
    modify: {},
  },
};

export const Simple: Story = {
  ...MockData,
};

export const WithName: Story = {
  ...MockData,
  args: {
    ...MockData.args,
    showName: true,
  },
};

export const OpenState: Story = {
  ...MockData,
  args: {
    ...MockData.args,
    modify: {
      forceOpenState: true,
    },
  },
};
