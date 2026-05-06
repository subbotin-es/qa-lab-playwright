import { allure } from 'allure-playwright';

export function step(stepName: string) {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const original = descriptor.value as (...args: unknown[]) => Promise<void>;

    descriptor.value = async function (...args: unknown[]): Promise<void> {
      await allure.step(stepName, async () => {
        await original.apply(this, args);
      });
    };

    return descriptor;
  };
}
