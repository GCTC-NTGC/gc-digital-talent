import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import WordCounter, { WordCounterProps } from "./WordCounter";

import BasicForm from "../BasicForm";
import Submit from "../Submit";
import TextArea from "../TextArea";

export default {
  component: WordCounter,
  title: "Components/Word Counter",
  args: {
    text: "",
    wordLimit: 5,
  },
};

const TemplateWordCounter: StoryFn<
  WordCounterProps & {
    text: string;
  }
> = ({ text, ...args }) => {
  return (
    <div style={{ width: "20rem" }}>
      <BasicForm onSubmit={action("submit")}>
        <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
          <TextArea
            id="wordCounter"
            name="wordCounter"
            label="Word Counter"
            value={text}
          />
          <WordCounter {...args} data-h2-align-self="base(flex-end)" />
        </div>
        <Submit />
      </BasicForm>
    </div>
  );
};

export const UnderLimit = TemplateWordCounter.bind({});
export const AtLimit = TemplateWordCounter.bind({});
export const OverLimit = TemplateWordCounter.bind({});

UnderLimit.args = {
  text: "Hello world!",
};

AtLimit.args = {
  text: "Word counters are very cool.",
};

OverLimit.args = {
  text: "Wow! This word counter is awesome!",
};
