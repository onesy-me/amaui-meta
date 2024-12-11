/* tslint:disable: no-shadowed-variable */
import { assert } from '@onesy/test';

import { evaluate } from '../utils/js/test/utils';

import OnesyMeta from '../src';

group('OnesyMeta', () => {

  preTo(() => OnesyMeta.reset());

  group('decorators', () => {

    to('class', async () => {
      @OnesyMeta.class(
        'a',
        4
      )
      class A { }

      const valueNode = OnesyMeta.get('a', A);

      assert(valueNode).eq(4);
    });

    to('method', async () => {
      class A {

        @OnesyMeta.method(
          'a',
          4
        )
        public m() {

        }
      }

      const valueNode = OnesyMeta.get('a', A, 'm');

      assert(valueNode).eql(4);
    });

    to('property', async () => {
      class A {
        @OnesyMeta.property(
          'a',
          4
        )
        public p = 'a';

      }

      const valueNode = OnesyMeta.get('a', A, 'p');

      assert(valueNode).eq(4);
    });

    to('parameter', async () => {
      class A {

        public m(
          @OnesyMeta.parameter(
            4
          )
          p = 'a'
        ) { }

      }

      const valueNode = OnesyMeta.get('onesy-meta-param:0', A, 'm');

      assert(valueNode).eq(4);
    });

  });

  group('add', async () => {

    to('add', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.OnesyMeta.add('a', 4, object);
        window.OnesyMeta.add('a', 4, object, 'p');

        return [window.OnesyMeta.get('a', object), window.OnesyMeta.get('a', object, 'p')];
      });

      const object = {};

      OnesyMeta.add('a', 4, object);
      OnesyMeta.add('a', 4, object, 'p');

      const valueNode = [OnesyMeta.get('a', object), OnesyMeta.get('a', object, 'p')];

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([4, 4]));
    });

    to('override', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.OnesyMeta.add('a', 40, object);
        window.OnesyMeta.add('a', 4, object);

        // tslint:disable-next-line
        const result = [];

        window.OnesyMeta.options = { add: { override: true } };

        result.push(window.OnesyMeta.get('a', object));

        // Update add override option
        window.OnesyMeta.options = { add: { override: false } };

        result.push(window.OnesyMeta.get('a', object));

        return result;
      });

      const object = {};

      OnesyMeta.add('a', 40, object);
      OnesyMeta.add('a', 4, object);

      // tslint:disable-next-line
      const result = [];

      OnesyMeta.options = { add: { override: true } };

      result.push(OnesyMeta.get('a', object));

      // Update add override option
      OnesyMeta.options = { add: { override: false } };

      result.push(OnesyMeta.get('a', object));

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([4, 4]));
    });

  });

  to('update', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.OnesyMeta.add('a', 4, object);
      window.OnesyMeta.add('a', 4, object, 'p');

      window.OnesyMeta.update('a', 7, object);
      window.OnesyMeta.update('a', 7, object, 'p');
      window.OnesyMeta.update('ab', 4, object);

      return [
        window.OnesyMeta.get('a', object),
        window.OnesyMeta.get('a', object, 'p'),
        window.OnesyMeta.get('ab', object),
      ];
    });

    const object = {};

    OnesyMeta.add('a', 4, object);
    OnesyMeta.add('a', 4, object, 'p');

    OnesyMeta.update('a', 7, object);
    OnesyMeta.update('a', 7, object, 'p');
    OnesyMeta.update('ab', 4, object);

    const valueNode = [
      OnesyMeta.get('a', object),
      OnesyMeta.get('a', object, 'p'),
      OnesyMeta.get('ab', object),
    ];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([
      7,
      7,
      undefined,
    ]));
  });

  group('get', () => {

    to('get', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.OnesyMeta.add('a', 4, object);

        return window.OnesyMeta.get('a', object);
      });

      const object = {};

      OnesyMeta.add('a', 4, object);

      const valueNode = OnesyMeta.get('a', object);

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eq(4));
    });

    to('No object', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        return window.OnesyMeta.get('ab', object);
      });

      const object = {};

      const valueNode = OnesyMeta.get('ab', object);

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eq(undefined));
    });

    to('copy', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};
        // tslint:disable-next-line
        const value = {};

        window.OnesyMeta.add('a', value, object);

        // tslint:disable-next-line
        const result = [];

        // By default value is not copied
        // and value for array and object values is the same
        window.OnesyMeta.options = { value: { copy: false } };

        result.push(value === window.OnesyMeta.get('a', object));

        // Update value.copy option
        window.OnesyMeta.options = { value: { copy: true } };

        window.OnesyMeta.add(value, 'a', object);

        // With value.copy true, value is copied and
        // value for array and object values reference is not the same
        result.push(object !== window.OnesyMeta.get('a', object));

        return result;
      });

      const object = {};
      const value = {};

      OnesyMeta.add('a', value, object);

      const result = [];

      // By default value is not copied
      // and value for array and object values is the same
      OnesyMeta.options = { value: { copy: false } };

      result.push(value === OnesyMeta.get('a', object));

      // Update value copy option
      OnesyMeta.options = { value: { copy: true } };

      OnesyMeta.add(object, 'a', object);

      // With value copy true, value is copied and
      // value for array and object values reference is not the same
      result.push(value !== OnesyMeta.get('a', object));

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([true, true]));
    });

  });

  to('has', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.OnesyMeta.add('a', 4, object);

      return [window.OnesyMeta.has('a', object), window.OnesyMeta.has('aa', object)];
    });

    const object = {};

    OnesyMeta.add('a', 4, object);

    const valueNode = [OnesyMeta.has('a', object), OnesyMeta.has('aa', object)];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([true, false]));
  });

  to('values', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.OnesyMeta.add('a', 4, object);
      window.OnesyMeta.add('aa', 4, object);

      return window.OnesyMeta.values(object);
    });

    const object = {};

    OnesyMeta.add('a', 4, object);
    OnesyMeta.add('aa', 4, object);

    const valueNode = OnesyMeta.values(object);

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([4, 4]));
  });

  group('keys', () => {

    to('keys', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        window.OnesyMeta.add('a', 4, object);
        window.OnesyMeta.add('aa', 4, object);

        return window.OnesyMeta.keys(object);
      });

      const object = {};

      OnesyMeta.add('a', 4, object);
      OnesyMeta.add('aa', 4, object);

      const valueNode = OnesyMeta.keys(object);

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql(['a', 'aa']));
    });

    to('No keys', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        // tslint:disable-next-line
        const object = {};

        return [
          window.OnesyMeta.keys(object),
          window.OnesyMeta.keys(object, 'p'),
        ];
      });

      const object = {};

      const valueNode = [
        OnesyMeta.keys(object),
        OnesyMeta.keys(object, 'p'),
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

      window.OnesyMeta.add('a', 4, object);

      // tslint:disable-next-line
      const a = window.OnesyMeta.get('a', object);

      window.OnesyMeta.remove('a', object);

      return [a, window.OnesyMeta.get('a', object, 'p')];
    });

    const object = {};

    OnesyMeta.add('a', 4, object);

    const a = OnesyMeta.get('a', object);

    OnesyMeta.remove('a', object);

    const valueNode = [a, OnesyMeta.get('a', object, 'p')];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([4, undefined]));
  });

  to('reset', async () => {
    const valueBrowsers = await evaluate((window: any) => {
      // tslint:disable-next-line
      const object = {};

      window.OnesyMeta.add('a', 4, object);
      window.OnesyMeta.add('a', 4, object, 'p');

      window.OnesyMeta.reset();

      return [
        window.OnesyMeta.keys(object),
        window.OnesyMeta.keys(object, 'p'),
      ];
    });

    const object = {};

    OnesyMeta.add('a', 4, object);
    OnesyMeta.add('a', 4, object, 'p');

    OnesyMeta.reset();

    const valueNode = [
      OnesyMeta.keys(object),
      OnesyMeta.keys(object, 'p'),
    ];

    const values = [valueNode, ...valueBrowsers];

    values.forEach(value => assert(value).eql([
      undefined,
      undefined,
    ]));
  });

});
