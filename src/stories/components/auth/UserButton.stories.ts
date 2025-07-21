import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
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
  play: async ({ canvas, userEvent, args }) => {
    const userButton = await canvas.findByTestId("user-button-trigger");
    await userEvent.click(userButton);

    const userButtonContent = await within(document.body).findByTestId(
      "user-button-content",
    );
    await expect(userButtonContent).toBeInTheDocument();

    const userName = within(userButtonContent).queryByText(
      `@${args.userdata.user.username}`,
    );
    await expect(userName).toBeInTheDocument();

    const managingButton = within(userButtonContent).queryByTestId(
      "user-button-manage-account",
    );

    await expect(managingButton).toBeInTheDocument();

    await userEvent.click(managingButton!);

    const managingButtonLoadingState = within(managingButton!).queryByTestId(
      "user-button-manage-account-loadingState",
    );

    await expect(managingButtonLoadingState).toBeInTheDocument();

    const signOutButton = within(userButtonContent).queryByTestId(
      "user-button-sign-out",
    );

    await expect(signOutButton).toBeInTheDocument();

    await userEvent.click(signOutButton!);

    const signOutButtonLoadingState = within(signOutButton!).queryByTestId(
      "user-button-sign-out-loadingState",
    );

    await expect(signOutButtonLoadingState).toBeInTheDocument();
  },
};

export const WithName: Story = {
  ...MockData,
  args: {
    ...MockData.args,
    showName: true,
  },
  play: async ({ canvas, userEvent, args, ...props }) => {
    const userName = await canvas.findByText(args.userdata.user.name);

    await expect(userName).toBeVisible();

    await Simple.play!({ canvas, userEvent, args, ...props });
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
