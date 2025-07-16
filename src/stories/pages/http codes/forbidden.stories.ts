import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import Forbidden from "~/components/pages/forbidden";

const meta: Meta = {
  title: "Pages/HTTP Codes/Forbidden",
  component: Forbidden,
};

export default meta;

type Story = StoryObj<typeof Forbidden>;

export const Default: Story = {
  args: {},
};
