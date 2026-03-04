import { useTheme } from "#storybook/preview";
import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
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
    beta: {
      control: { type: "boolean" },
      description: "Shows the beta string in the header.",
      defaultValue: false,
    },
    print: {
      control: { type: "boolean" },
      description: "Enables print styles and full text.",
      defaultValue: false,
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => {
      const { print } = context.args;
      const { getTheme, setTheme } = useTheme();

      useEffect(() => {
        if (print) {
          const oldTheme = getTheme();
          setTheme("light");

          // Cleanup function to restore theme when print prop changes
          return () => {
            setTheme(oldTheme);
          };
        }
      }, [print, getTheme, setTheme]);

      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const SignedOut: Story = {
  args: {
    assumeSignedIn: false,
    authData: null,
    beta: false,
    print: false,
  },
};

export const SignedIn: Story = {
  args: {
    assumeSignedIn: true,
    authData: mockSessionData,
    beta: false,
    print: false,
  },
};

export const OutBeta: Story = {
  name: "Signed Out with Beta",
  args: {
    ...SignedOut.args,
    beta: true,
  },
};

export const InBeta: Story = {
  name: "Signed In with Beta",
  args: {
    ...SignedIn.args,
    beta: true,
  },
};

export const OutPrint: Story = {
  name: "Signed Out with Print Styles",
  args: {
    ...SignedOut.args,
    print: true,
  },
};

export const InPrint: Story = {
  name: "Signed In with Print Styles",
  args: {
    ...SignedIn.args,
    print: true,
  },
};
