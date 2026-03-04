import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import Unauthorized from "~/components/pages/unauthorised";

const meta: Meta = {
  title: "Pages/HTTP Codes/Unauthorized",
  component: Unauthorized,
};

export default meta;

type Story = StoryObj<typeof Unauthorized>;

export const Default: Story = {
  args: {},
};
