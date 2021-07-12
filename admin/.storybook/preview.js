import "../resources/css/hydrogen.css"
import "../resources/css/app.css"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
    (Story) => (
      <div data-h2-font-family="b(sans)">
        <Story />
      </div>
    ),
  ];
