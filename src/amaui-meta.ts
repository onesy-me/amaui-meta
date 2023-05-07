import is from '@amaui/utils/is';
import copy from '@amaui/utils/copy';
import { TObject } from '@amaui/models';

const unix = () => Math.floor(new Date().getTime() / 1000);

export interface IOptionsValue {
  copy?: boolean;
}

export interface IOptionsAdd {
  override?: boolean;
}

export interface IOptions {
  value?: IOptionsValue;
  add?: IOptionsAdd;
}

const optionsDefault: IOptions = {
  value: {
    copy: false,
  },
  add: {
    override: true,
  },
};

class AmauiMeta {
  public static meta = new WeakMap();
  private static options_: IOptions = optionsDefault;

  public static get options() {
    return this.options_;
  }

  public static set options(value: IOptions) {
    this.options_ = { ...this.options, ...value };
  }

  // Class decorator
  public static class(...args: any[]): ClassDecorator {
    return (object: TObject) => {
      const [key, value] = args;

      // Add key and value to object which is a class itself
      this.add(key, value, object);
    };
  }

  // Method decorator
  public static method(...args: any[]): MethodDecorator {
    return (object_: TObject, property: string): void => {
      const object = object_.constructor;
      const [key, value] = args;

      // Add key and value to object property which is a class's method
      this.add(key, value, object, property);
    };
  }

  // Property decorator
  public static property(...args: any[]): PropertyDecorator {
    return (object_: TObject, property: string): void => {
      const object = object_.constructor;
      const [key, value] = args;

      // Add key and value to object property which is a class's property
      this.add(key, value, object, property);
    };
  }

  // Parameter decorator
  public static parameter(...args: any[]): ParameterDecorator {
    return (object_: TObject, property: string, parameterIndex: number): void => {
      const object = object_.constructor;
      const [value] = args;

      // Add key and value to object property which is a class's method
      this.add(`amaui-meta-param:${parameterIndex}`, value, object, property);
    };
  }

  public static add(key: any, value: any, object: any, property?: any): void {
    // A WeakMap's key can only be
    // of a reference value type
    if (!is('simple', object)) {
      const value_ = this.options.value.copy ? copy(value) : value;

      let mapObject: Map<any, any> = this.meta.get(object);

      if (!mapObject) {
        // Add a new map for the object
        mapObject = new Map();

        this.meta.set(object, mapObject);
      }

      if (property !== undefined) {
        let mapProperty: Map<any, any> = mapObject.get(property);

        if (!mapProperty) {
          // Add a new map for the object's property
          mapProperty = new Map();

          mapObject.set(property, mapProperty);
        }

        if (
          !mapProperty.has(key) ||
          this.options.add.override
        ) {
          // Set map property's key and value
          mapProperty.set(key, {
            value: this.options.value.copy ? copy(value) : value,
            added_at: unix(),
          });

          return value_;
        }
      }
      else {
        if (
          !mapObject.has(key) ||
          this.options.add.override
        ) {
          // Set map object's key and value
          mapObject.set(key, {
            value: this.options.value.copy ? copy(value) : value,
            added_at: unix(),
          });

          return value_;
        }
      }
    }
  }

  public static update(key: any, value: any, object: any, property?: any): void {
    // A WeakMap's key can only be
    // of a reference value type
    if (!is('simple', object)) {
      const value_ = this.options.value.copy ? copy(value) : value;

      let mapObject: Map<any, any> = this.meta.get(object);

      if (!mapObject) {
        // Add a new map for the object
        mapObject = new Map();

        this.meta.set(object, mapObject);
      }

      if (property !== undefined) {
        let mapProperty: Map<any, any> = mapObject.get(property);

        if (!mapProperty) {
          // Add a new map for the object's property
          mapProperty = new Map();

          mapObject.set(property, mapProperty);
        }

        if (mapProperty.has(key)) {
          // Set map property's key and value
          const atmValue = mapProperty.get(key);

          atmValue.value = value_;
          atmValue.updated_at = unix();

          mapProperty.set(key, atmValue);

          return value_;
        }
      }
      else {
        if (mapObject.has(key)) {
          // Set map object's key and value
          const atmValue = mapObject.get(key);

          atmValue.value = value_;
          atmValue.updated_at = unix();

          mapObject.set(key, atmValue);

          return value_;
        }
      }
    }
  }

  public static values(object: any, property?: any): Array<any> | undefined {
    // A WeakMap's key can only be
    // of a reference value type
    if (!is('simple', object)) {
      const mapObject: Map<any, any> = this.meta.get(object);

      if (!mapObject) return;

      if (property !== undefined) {
        const mapProperty: Map<any, any> = mapObject.get(property);

        // Return object property's values as array
        return mapProperty && Array.from(mapProperty.values());
      }

      // Return object's values as array
      return mapObject && Array.from(mapObject.values()).map(item => item.value);
    }
  }

  public static keys(object: any, property?: any): Array<any> | undefined {
    // A WeakMap's key can only be
    // of a reference value type
    if (!is('simple', object)) {
      const mapObject: Map<any, any> = this.meta.get(object);

      if (!mapObject) return;

      if (property !== undefined) {
        const mapProperty: Map<any, any> = mapObject.get(property);

        // Return object property's keys as array
        return mapProperty && Array.from(mapProperty.keys());
      }

      // Return object's keys as array
      return mapObject && Array.from(mapObject.keys());
    }
  }

  public static get(key: any, object: any, property?: any): any | undefined {
    // A WeakMap's key can only be
    // of a reference value type
    if (!is('simple', object)) {
      const mapObject: Map<any, any> = this.meta.get(object);

      if (!mapObject) return;

      if (property !== undefined) {
        const mapProperty: Map<any, any> = mapObject.get(property);

        if (!mapProperty) return;

        if (!mapProperty.has(key)) return;

        // Get map property key's and value
        return this.options.value.copy ? copy(mapProperty.get(key).value) : mapProperty.get(key).value;
      }

      if (!mapObject.has(key)) return;

      // Get map object key's and value
      return this.options.value.copy ? copy(mapObject.get(key).value) : mapObject.get(key).value;
    }
  }

  public static has(key: any, object: any, property?: any): boolean {
    // A WeakMap's key can only be
    // of a reference value type
    if (!is('simple', object)) {
      const mapObject: Map<any, any> = this.meta.get(object);

      if (!mapObject) return false;

      if (property !== undefined) {
        const mapProperty: Map<any, any> = mapObject.get(property);

        if (!mapProperty) return false;

        // Map has property key
        return mapProperty.has(key);
      }

      // Map has object key's and value
      return mapObject.has(key);
    }
  }

  public static remove(key: any, object: any, property?: any): void {
    // A WeakMap's key can only be
    // of a reference value type
    if (!is('simple', object)) {
      const mapObject: Map<any, any> = this.meta.get(object);

      if (!mapObject) return;

      if (property !== undefined) {
        const mapProperty: Map<any, any> = mapObject.get(property);

        if (!mapProperty) return;

        // Remove map property's key and value
        mapProperty.delete(key);
      }
      else {
        // Remove map object's key and value
        mapObject.delete(key);
      }
    }
  }

  public static reset(): void {
    this.meta = new WeakMap();

    this.options = optionsDefault;
  }
}

export default AmauiMeta;
