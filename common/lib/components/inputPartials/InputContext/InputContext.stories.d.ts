import React from "react";
import { Story, Meta } from "@storybook/react";
declare const meta: Meta;
export default meta;
export declare const Context: Story<{
    isVisible: boolean;
    context: string;
} & {
    children?: React.ReactNode;
}>;
