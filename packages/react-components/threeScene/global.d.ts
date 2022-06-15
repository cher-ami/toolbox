declare module "*.module.less";

declare module "*?url";
declare module "*?raw" {
  const content: string;
  export default content;
}

declare module "*.frag";
declare module "*.vert";
declare module "*.glb";
declare module "*.gltf";
