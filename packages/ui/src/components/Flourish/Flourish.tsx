import { tv } from "tailwind-variants";

const flourish = tv({
  base: "block h-6 bg-linear-(--gradient-main-linear)",
});

const Flourish = ({ className }: { className?: string }) => (
  <div className={flourish({ class: className })} />
);

export default Flourish;
