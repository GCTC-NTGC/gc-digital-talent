import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { WordCounterProps } from ".";
import { BasicForm, Submit, TextArea } from "../form";
import WordCounter from "./WordCounter";

export default {
  component: WordCounter,
  title: "Components/Word Counter",
  args: {
    text: "",
    wordLimit: 5,
  },
} as Meta;

const TemplateWordCounter: Story<WordCounterProps> = (args) => {
  const { text } = args;
  return (
    <div style={{ width: "20rem" }}>
      <BasicForm onSubmit={action("submit")}>
        <div data-h2-display="b(flex)" data-h2-flex-direction="b(column)">
          <TextArea
            id="wordCounter"
            name="wordCounter"
            label="Word Counter"
            value={text}
          />
          <WordCounter {...args} data-h2-align-self="b(flex-end)" />
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
