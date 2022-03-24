import { Group, Mesh } from "three"

/**
 * Set same property value on every children materials of group
 * @param  {Group} group
 * @param  {string} property
 * @param  {} value
 */
function setGroupChildrenMaterialProp(group: Group, property: string, value: any) {
  group.children.forEach((child: Mesh) => {
    const childMesh: Mesh = child?.isMesh ? child : (child.children[0] as Mesh)
    if (property in childMesh.material) {
      childMesh.material[property] = value
    } else if (Array.isArray(childMesh.material)) {
      childMesh.material.forEach(
        (material) => property in material && (material[property] = value)
      )
    } else {
      console.error("Property", property, "not found on", child.material)
      return
    }
  })
}

export default setGroupChildrenMaterialProp
