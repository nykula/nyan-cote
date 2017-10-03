/**
 * Helps pass class names to microservices after applying decorators that create
 * new classes named like `class_1`.
 */
export function getClassName(constructor: any): string {
  return constructor.displayName || constructor.name;
}
