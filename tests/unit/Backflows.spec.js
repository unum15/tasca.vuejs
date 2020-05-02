import Backflow from '@/common/Backflows.js';

describe('Backflows', () => {
  it('DC passes', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'DC'
        }
      },
      reading_1 : 2,
      reading_2 : 2
    };
    let result = Backflow.passed(item);
    expect(result).toBe(true);
  });
  it('DC fails', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'DC'
        }
      },
      reading_1 : 0.5,
      reading_2 : 0.5
    };
    let result = Backflow.passed(item);
    expect(result).toBe(false);
  });
  it('DC equals', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'DC'
        }
      },
      reading_1 : 1,
      reading_2 : 1
    };
    let result = Backflow.passed(item);
    expect(result).toBe(true);
  });
  it('PVB passes', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'PVB'
        }
      },
      reading_1 : 2,
      reading_2 : 2
    };
    let result = Backflow.passed(item);
    expect(result).toBe(true);
  });
  it('PVB fails', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'PVB'
        }
      },
      reading_1 : 0.5,
      reading_2 : 0.5
    };
    let result = Backflow.passed(item);
    expect(result).toBe(false);
  });
  it('PVB equals', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'PVB'
        }
      },
      reading_1 : 1,
      reading_2 : 1
    };
    let result = Backflow.passed(item);
    expect(result).toBe(true);
  });
  it('RP passes', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'RP'
        }
      },
      reading_1 : 5,
      reading_2 : 10
    };
    let result = Backflow.passed(item);
    expect(result).toBe(true);
  });
  it('RP fails', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'RP'
        }
      },
      reading_1 : 0.5,
      reading_2 : 0.5
    };
    let result = Backflow.passed(item);
    expect(result).toBe(false);
  });
  it('RP equals', () => {
    let item = {
      backflow_type : {
        backflow_super_type : {
            name: 'RP'
        }
      },
      reading_1 : 2,
      reading_2 : 5
    };
    let result = Backflow.passed(item);
    expect(result).toBe(true);
  });
});