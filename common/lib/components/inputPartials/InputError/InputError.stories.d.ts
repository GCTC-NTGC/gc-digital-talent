import React from "react";
import { Story, Meta } from "@storybook/react";
declare const meta: Meta;
export default meta;
export declare const Error: Story<{
    isVisible: boolean;
    error: string;
} & {
    children?: React.ReactNode;
}>;
