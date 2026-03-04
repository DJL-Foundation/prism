import { useTheme } from "#storybook/preview";
import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import Footer from "~/components/layout/footer";

const meta: Meta<typeof Footer> = {
  title: "Components/Layout/Footer",
  component: Footer,
  argTypes: {
    beta: {
      name: "Beta",
      description: "Whether to show the beta badge",
      defaultValue: false,
      control: { type: "boolean" },
    },
    print: {
      name: "Print Styles",
      description: "Whether to apply print styles and full text",
      defaultValue: false,
      control: { type: "boolean" },
    },
  },
  tags: ["autodocs"],
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

type Story = StoryObj<typeof Footer>;

export const Simple: Story = {
  args: {
    beta: false,
    print: false,
  },
};

export const Beta: Story = {
  args: {
    beta: true,
    print: false,
  },
};

export const Print: Story = {
  args: {
    beta: false,
    print: true,
  },
};
