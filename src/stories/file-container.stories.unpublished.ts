import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import FileContainer from "~/components/file-container";

const meta: Meta = {
  title: "Components/View/FileContainer",
  component: FileContainer,
};

export default meta;

type Story = StoryObj<typeof FileContainer>;

export const Simple: Story = {
  args: {},
};
