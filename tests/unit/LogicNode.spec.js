import LogicNode from '@/common/LogicNode.js';

describe('LogicNode', () => {
  it('parses blank as null', () => {
    let logic = new LogicNode('');
    expect(logic.value).toBeNull();
  });
});

describe('LogicNode', () => {
  it('blank matches return true', () => {
    let logic = new LogicNode('');
    expect(logic.matches(5)).toBe(true);
  });
});

describe('LogicNode', () => {
  it('partial equation as null', () => {
    let logic = new LogicNode('<');
    expect(logic.value).toBeNull();
  });
});

describe('LogicNode', () => {
  it('assume = on number', () => {
    let logic = new LogicNode('5');
    expect(logic.value).toBe('5');
  });
});

describe('LogicNode', () => {
  it('return true on number match', () => {
    let logic = new LogicNode('5', true);
    expect(logic.matches(5)).toBe(true);
  });
});

describe('LogicNode', () => {
  it('return false on number not match', () => {
    let logic = new LogicNode('5', true);
    expect(logic.matches(1)).toBe(false);
  });
});

describe('LogicNode', () => {
  it('simple equals test', () => {
    let logic = new LogicNode('=5', true);
    expect(logic.matches(5)).toBe(true);
    expect(logic.matches(1)).toBe(false);
    expect(logic.matches(12)).toBe(false);
  });
});

describe('LogicNode', () => {
  it('simple greater than test', () => {
    let logic = new LogicNode('>5', true);
    expect(logic.matches(5)).toBe(false);
    expect(logic.matches(1)).toBe(false);
    expect(logic.matches(12)).toBe(true);
  });
});

describe('LogicNode', () => {
  it('simple greater than or equal to test', () => {
    let logic = new LogicNode('>=5', true);
    expect(logic.matches(5)).toBe(true);
    expect(logic.matches(1)).toBe(false);
    expect(logic.matches(12)).toBe(true);
  });
});

describe('LogicNode', () => {
  it('simple less than test', () => {
    let logic = new LogicNode('<5', true);
    expect(logic.matches(5)).toBe(false);
    expect(logic.matches(1)).toBe(true);
    expect(logic.matches(12)).toBe(false);
  });
});

describe('LogicNode', () => {
  it('simple less than or equal to test', () => {
    let logic = new LogicNode('<=5', true);
    expect(logic.matches(5)).toBe(true);
    expect(logic.matches(1)).toBe(true);
    expect(logic.matches(12)).toBe(false);
  });
});

describe('LogicNode', () => {
  it('simple "and" test', () => {
    let logic = new LogicNode('<=5 and =4', true);
    expect(logic.matches(5)).toBe(false);
    expect(logic.matches(1)).toBe(false);
    expect(logic.matches(4)).toBe(true);
    expect(logic.matches(12)).toBe(false);
  });
});

describe('LogicNode', () => {
  it('simple "or" test', () => {
    let logic = new LogicNode('<=5 or =8', true);
    expect(logic.matches(5)).toBe(true);
    expect(logic.matches(1)).toBe(true);
    expect(logic.matches(8)).toBe(true);
    expect(logic.matches(12)).toBe(false);
    expect(logic.matches(7)).toBe(false);
  });
});

describe('LogicNode', () => {
  it('half written test', () => {
    let logic = new LogicNode('<=5 or', true);
    expect(logic.matches(5)).toBe(true);
    expect(logic.matches(1)).toBe(true);
    expect(logic.matches(8)).toBe(true);
    expect(logic.matches(12)).toBe(true);
    expect(logic.matches(7)).toBe(true);
  });
});