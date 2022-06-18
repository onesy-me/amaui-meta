/* tslint:disable: no-shadowed-variable */
import { assert } from '@amaui/test';

import { evaluate } from '../utils/js/test/utils';

import AmauiMeta from '../src';

group('@amaui/meta', () => {

  preTo(() => AmauiMeta.reset());

  group('decorators', () => {

    to('class', async () => {
      @AmauiMeta.class(
        'a',
        4
      )
      class A { }

      const valueNode = AmauiMeta.get('a', A);

      assert(valueNode).eq(4);
    });

    to('method', async () => {
      class A {

        @AmauiMeta.method(
          'a',
          4
        )
        public m() {

        }
      }

      const valueNode = AmauiMeta.get('a', A, 'm');

      assert(valueNode).eql(4);
    });

    to('property', async () => {
      class A {
        @AmauiMeta.property(
          'a',
          4
        )
        public p = 'a';

      }

      const valueNode = AmauiMeta.get('a', A, 'p');

      assert(valueNode).eq(4);
    });

    to('parameter', async () => {
      class A {

        public m(
          @AmauiMeta.parameter(
            4
          )
          p = 'a'
        ) { }

      }

      const valueNode = AmauiMeta.get('amaui-meta-param:0', A, 'm');

      assert(valueNode).eq(4);
    });

  });

  group('add', async () => {

    to('add', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.AmauiMeta.add('a', 4, object);
        window.AmauiMeta.add('a', 4, object, 'p');

        return [window.AmauiMeta.get('a', object), window.AmauiMeta.get('a', object, 'p')];
      });

      const object = {};

      AmauiMeta.add('a', 4, object);
      AmauiMeta.add('a', 4, object, 'p');

      const valueNode = [AmauiMeta.get('a', object), AmauiMeta.get('a', object, 'p')];

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([4, 4]));
    });

    to('override', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.AmauiMeta.add('a', 40, object);
        window.AmauiMeta.add('a', 4, object);

        // tslint:disable-next-line
        const result = [];

        window.AmauiMeta.options = { add: { override: true } };

        result.push(window.AmauiMeta.get('a', object));

        // Update add override option
        window.AmauiMeta.options = { add: { override: false } };

        result.push(window.AmauiMeta.get('a', object));

        return result;
      });

      const object = {};

      AmauiMeta.add('a', 40, object);
      AmauiMeta.add('a', 4, object);

      // tslint:disable-next-line
      const result = [];

      AmauiMeta.options = { add: { override: true } };

      result.push(AmauiMeta.get('a', object));

      // Update add override option
      AmauiMeta.options = { add: { override: false } };

      result.push(AmauiMeta.get('a', object));

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([4, 4]));
    });

  });

  to('update', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.AmauiMeta.add('a', 4, object);
      window.AmauiMeta.add('a', 4, object, 'p');

      window.AmauiMeta.update('a', 7, object);
      window.AmauiMeta.update('a', 7, object, 'p');
      window.AmauiMeta.update('ab', 4, object);

      return [
        window.AmauiMeta.get('a', object),
        window.AmauiMeta.get('a', object, 'p'),
        window.AmauiMeta.get('ab', object),
      ];
    });

    const object = {};

    AmauiMeta.add('a', 4, object);
    AmauiMeta.add('a', 4, object, 'p');

    AmauiMeta.update('a', 7, object);
    AmauiMeta.update('a', 7, object, 'p');
    AmauiMeta.update('ab', 4, object);

    const valueNode = [
      AmauiMeta.get('a', object),
      AmauiMeta.get('a', object, 'p'),
      AmauiMeta.get('ab', object),
    ];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([
      7,
      7,
      undefined,
    ]));
  });

  to('values', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.AmauiMeta.add('a', 4, object);
      window.AmauiMeta.add('aa', 4, object);

      return window.AmauiMeta.values(object);
    });

    const object = {};

    AmauiMeta.add('a', 4, object);
    AmauiMeta.add('aa', 4, object);

    const valueNode = AmauiMeta.values(object);

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([4, 4]));
  });

  group('get', () => {

    to('get', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.AmauiMeta.add('a', 4, object);

        return window.AmauiMeta.get('a', object);
      });

      const object = {};

      AmauiMeta.add('a', 4, object);

      const valueNode = AmauiMeta.get('a', object);

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eq(4));
    });

    to('No object', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        return window.AmauiMeta.get('ab', object);
      });

      const object = {};

      const valueNode = AmauiMeta.get('ab', object);

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eq(undefined));
    });

    to('copy', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};
        // tslint:disable-next-line
        const value = {};

        window.AmauiMeta.add('a', value, object);

        // tslint:disable-next-line
        const result = [];

        // By default value is not copied
        // and value for array and object values is the same
        window.AmauiMeta.options = { value: { copy: false } };

        result.push(value === window.AmauiMeta.get('a', object));

        // Update value.copy option
        window.AmauiMeta.options = { value: { copy: true } };

        window.AmauiMeta.add(value, 'a', object);

        // With value.copy true, value is copied and
        // value for array and object values reference is not the same
        result.push(object !== window.AmauiMeta.get('a', object));

        return result;
      });

      const object = {};
      const value = {};

      AmauiMeta.add('a', value, object);

      const result = [];

      // By default value is not copied
      // and value for array and object values is the same
      AmauiMeta.options = { value: { copy: false } };

      result.push(value === AmauiMeta.get('a', object));

      // Update value copy option
      AmauiMeta.options = { value: { copy: true } };

      AmauiMeta.add(object, 'a', object);

      // With value copy true, value is copied and
      // value for array and object values reference is not the same
      result.push(value !== AmauiMeta.get('a', object));

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([true, true]));
    });

  });

  to('has', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.AmauiMeta.add('a', 4, object);

      return [window.AmauiMeta.has('a', object), window.AmauiMeta.has('aa', object)];
    });

    const object = {};

    AmauiMeta.add('a', 4, object);

    const valueNode = [AmauiMeta.has('a', object), AmauiMeta.has('aa', object)];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([true, false]));
  });

  group('keys', () => {

    to('keys', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.AmauiMeta.add('a', 4, object);
        window.AmauiMeta.add('aa', 4, object);

        return window.AmauiMeta.keys(object);
      });

      const object = {};

      AmauiMeta.add('a', 4, object);
      AmauiMeta.add('aa', 4, object);

      const valueNode = AmauiMeta.keys(object);

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql(['a', 'aa']));
    });

    to('No keys', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        return [
          window.AmauiMeta.keys(object),
          window.AmauiMeta.keys(object, 'p'),
        ];
      });

      const object = {};

      const valueNode = [
        AmauiMeta.keys(object),
        AmauiMeta.keys(object, 'p'),
      ];

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([
        undefined,
        undefined,
      ]));
    });

  });

  to('remove', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.AmauiMeta.add('a', 4, object);

      // tslint:disable-next-line
      const a = window.AmauiMeta.get('a', object);

      window.AmauiMeta.remove('a', object);

      return [a, window.AmauiMeta.get('a', object, 'p')];
    });

    const object = {};

    AmauiMeta.add('a', 4, object);

    const a = AmauiMeta.get('a', object);

    AmauiMeta.remove('a', object);

    const valueNode = [a, AmauiMeta.get('a', object, 'p')];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([4, undefined]));
  });

  to('reset', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.AmauiMeta.add('a', 4, object);
      window.AmauiMeta.add('a', 4, object, 'p');

      window.AmauiMeta.reset();

      return [
        window.AmauiMeta.keys(object),
        window.AmauiMeta.keys(object, 'p'),
      ];
    });

    const object = {};

    AmauiMeta.add('a', 4, object);
    AmauiMeta.add('a', 4, object, 'p');

    AmauiMeta.reset();

    const valueNode = [
      AmauiMeta.keys(object),
      AmauiMeta.keys(object, 'p'),
    ];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([
      undefined,
      undefined,
    ]));
  });

});
