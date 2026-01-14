import { tv } from "tailwind-variants";

export const checkboxRadioStyles = tv({
  slots: {
    input:
      "m-0 grid size-6 shrink-0 transform appearance-none place-content-center border border-gray-700 bg-white leading-6 text-current before:size-3 before:scale-0 before:bg-secondary before:forced-color-adjust-none checked:before:scale-100 focus-visible:bg-focus focus-visible:before:bg-black dark:border-gray-100 dark:bg-gray-700 dark:before:bg-secondary-200",
  },
  variants: {
    shouldReduceMotion: {
      false: { input: "transition-transform duration-200 ease-in-out" },
    },
  },
});

export const inputStateStyles = tv({
  base: "border-gray-700 bg-white dark:border-gray-100 dark:bg-gray-600",
  variants: {
    state: {
      // NOTE: compat, remove when all inputs completed
      unset: "",
      invalid:
        "border-error-700 bg-error-100 dark:border-error-100 dark:bg-error-700",
      dirty: "border-secondary-700 dark:border-secondary-100",
    },
  },
});

export const inputStyles = tv({
  extend: inputStateStyles,
  base: "rounded-md border-1 p-3 text-black outline-offset-2 placeholder:text-gray-600/70 focus-visible:border-focus focus-visible:outline-2 focus-visible:outline-focus dark:text-white dark:placeholder:text-gray-100/70",
});

export const selectStyles = tv({
  extend: inputStyles,
  base: `appearance-none bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke-width%3D%271.5%27%20stroke%3D%27rgba(86%2C%2086%2C%2090%2C%201)%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20d%3D%27M19.5%208.25l-7.5%207.5-7.5-7.5%27/%3E%3C/svg%3E')] bg-[length:1rem_1rem] bg-[position:right_0.75rem_center] bg-no-repeat p-3 pr-9 dark:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke-width%3D%271.5%27%20stroke%3D%27rgba(191%2C%20191%2C%20191%2C%201)%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20d%3D%27M19.5%208.25l-7.5%207.5-7.5-7.5%27/%3E%3C/svg%3E')]`,
});
