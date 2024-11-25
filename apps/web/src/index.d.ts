/* eslint-disable import/no-unused-modules */
// Static asset extension declarations
declare module "*.jpg" {
  const url: string;
  export default url;
}
declare module "*.png" {
  const url: string;
  export default url;
}
declare module "*.svg" {
  const url: string;
  export default url;
}
declare module "*.webp" {
  const url: string;
  export default url;
}

// Hydrogen
declare module "@hydrogen-css/hydrogen";
