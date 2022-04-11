import * as React from "react";

const HelloWorld: React.FunctionComponent = (props) => {
  return (
    <table>
      <tbody>
        <tr>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-darkpink)"
          >ia-darkpink</td>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-pink)"
          >ia-pink</td>
          <td
            data-h2-font-color="b(black)"
            data-h2-bg-color="b(ia-lightpink)"
          >ia-lightpink</td>
        </tr>
        <tr>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-darkpurple)"
          >ia-darkpurple</td>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-purple)"
          >ia-purple</td>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-lightpurple)"
          >ia-lightpurple</td>
        </tr>
        <tr>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-black)"
          >ia-black</td>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-error)"
          >ia-error</td>
          <td
            data-h2-font-color="b(black)"
            data-h2-bg-color="b(ia-white)"
          >ia-white</td>
        </tr>
        <tr>
          <td
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(ia-darkgray)"
          >ia-darkgray</td>
          <td
            data-h2-font-color="b(black)"
            data-h2-bg-color="b(ia-gray)"
          >ia-gray</td>
          <td
            data-h2-font-color="b(black)"
            data-h2-bg-color="b(ia-lightgray)"
          >ia-lightgray</td>
        </tr>
        <tr>
          <td
            colSpan={3}
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(linear-90[ia-lightpurple][ia-darkpurple])"
          >ia-lightpurple ia-darkpurple</td>
        </tr>
        <tr>
          <td
            colSpan={3}
            data-h2-font-color="b(white)"
            data-h2-bg-color="b(linear-90[ia-pink][ia-darkpink])"
          >ia-pink ia-darkpink</td>
        </tr>
      </tbody>
    </table>
  );
};

export default HelloWorld
