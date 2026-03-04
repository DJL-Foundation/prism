import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import B2BHeroPage from "~/components/pages/B2B";

const meta: Meta<typeof B2BHeroPage> = {
  title: "Pages/Sales/B2B",
  component: B2BHeroPage,
};

export default meta;

type Story = StoryObj<typeof B2BHeroPage>;

export const Default: Story = {
  name: "B2B Hero Page",
  args: {},
};
