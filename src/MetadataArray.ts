import "reflect-metadata";

export class MetadataArray {
  public static get(key: symbol, target: any): string[] {
    return Reflect.getMetadata(key, target) || [];
  }

  public static push(key: symbol, target: any, value: any) {
    const requestHandlers = MetadataArray.get(key, target);
    requestHandlers.push(value);
    Reflect.defineMetadata(key, requestHandlers, target);
  }
}
