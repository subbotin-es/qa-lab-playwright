import { allure } from 'allure-playwright';

export function step(stepName: string) {
  return function <This, Args extends unknown[], Return>(
    originalMethod: (this: This, ...args: Args) => Return,
    _context: ClassMethodDecoratorContext,
  ): (this: This, ...args: Args) => Return {
    return async function (this: This, ...args: Args): Promise<unknown> {
      let result: unknown;
      await allure.step(stepName, async () => {
        result = await (originalMethod.apply(this, args) as Promise<unknown>);
      });
      return result;
    } as unknown as (this: This, ...args: Args) => Return;
  };
}
