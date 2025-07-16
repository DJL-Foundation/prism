import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import B2CHeroPage from "~/components/pages/B2C";

const meta: Meta<typeof B2CHeroPage> = {
  title: "Pages/Sales/B2C",
  component: B2CHeroPage,
};

export default meta;

type Story = StoryObj<typeof B2CHeroPage>;

export const Default: Story = {
  name: "B2C Hero Page",
  args: {},
};
