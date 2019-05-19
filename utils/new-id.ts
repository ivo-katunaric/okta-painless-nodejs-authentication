export function newId(objects: Array<{ id: number }>): number {
  return Math.max(...objects.map(object => object.id)) + 1;
}
