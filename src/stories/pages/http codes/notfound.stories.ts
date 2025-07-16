import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import NotFound from "~/components/pages/not-found";

const meta: Meta = {
  title: "Pages/HTTP Codes/Not Found",
  component: NotFound,
};

export default meta;

type Story = StoryObj<typeof NotFound>;

export const Default: Story = {
  args: {},
};
