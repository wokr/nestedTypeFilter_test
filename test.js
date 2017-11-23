const nestedTypeFilter = require('./');
const expect = require('chai').expect;

function generateDeepObjects(depth) {
  if(depth === 0) {
    return {
      foo: '123',
      bar: true,
      bas: 213,
    }
  }
  else {
    return {
      a: [generateDeepObjects(depth-1), generateDeepObjects(depth-1)],
      b: generateDeepObjects(depth-1),
    }
  };
}

function generateDeepSpec(depth) {
  if(depth === 0) {
    return {
      foo: String,
      bar: Boolean,
      bas: Number,
    }
  }
  else {
    return {
      a: [generateDeepSpec(depth-1)],
      b: generateDeepSpec(depth-1),
    }
  };
}


describe('nestedTypeFilter', function() {
  function testHelper(inputValue, spec, expected) {
    const result = nestedTypeFilter(inputValue, spec);
    expect(result).to.deep.equal(expected);
  }
  it('passes values of Number type', function() {
    testHelper(5, Number, 5);
    testHelper(0, Number, 0);
  });
  it('passes values of String type', function() {
    testHelper("dd", String, "dd");
    testHelper("", String, "");
  });
  it('passes values of Boolean type', function() {
    testHelper(false, Boolean, false);
    testHelper(true, Boolean, true);
  });
  it('fxitlers value if not Number', function() {
    testHelper(true, Number, undefined);
  });
  it('fxitlers value if not String', function() {
    testHelper(5, String, undefined);
  });
  it('fxitlers value if not Boolean', function() {
    testHelper(5, Boolean, undefined);
  });
  it('handle objects', function() {
    testHelper({
      a: 'aa',
      b: 5,
      c: 'str',
      d: 0,
      e: false,
      f: true
    }, {
      a: String,
      b: Number,
      c: Number,
      d: Boolean,
      e: Boolean,
      f: Number
    }, {
      a: 'aa',
      b: 5,
      e: false
    });
  })
  it('differntiates null from object', function() {
    testHelper(null, {}, undefined);
  });
  it('handles arrays', function() {
    const input = ['aa', 5, 'str', 0, false, true];
    testHelper(input, [Number], [5, 0]);
    testHelper(input, [String], ['aa', 'str']);
    testHelper(input, [Boolean], [false, true]);
  });
  xit('handles nested object', function() {
    testHelper({
      a: 'aa',
      b: {
        foo: '',
        bar: 5
      },
      f: ['1', '2', 3, 4]
    }, {
      a: String,
      b: {
        foo: String,
        bar: Number
      },
      f: [Number]
    }, {
      a: 'aa',
      b: {
        foo: '',
        bar: 5
      },
      f: [3, 4]
    });
  });
  xit('handles arbxitrarily deep object', function() {
    testHelper(generateDeepObjects(7), generateDeepSpec(7), generateDeepObjects(7));
  })
  xit('handles object spec inside of array', function() {
    testHelper([{
      a: 1, b: 'str'
    }, {
      a: 'str', b: 2
    }], [{
      a: Number
    }], [
      {a: 1},
      {}
    ]);
  });
});