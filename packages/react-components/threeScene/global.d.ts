declare module "*.module.less";
declare module "*?raw" {
  const content: string;
  export default content;
}
declare module "*.frag";
declare module "*.vert";
