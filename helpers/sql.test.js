const { sqlForPartialUpdate }  = require('./sql');
const { BadRequestError } = require('../expressError');

describe('sqlForPartialUpdate', () => {
  it('should generate correct SET clause and values array for valid input', () => {
    const dataToUpdate = { firstName: 'John', age: 30 };
    const jsToSql = { firstName: 'first_name' };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(setCols).toBe('"first_name"=$1, "age"=$2');
    expect(values).toEqual(['John', 30]);
  });

  it('should throw BadRequestError if no data is provided', () => {
    expect(() => {
      sqlForPartialUpdate({}, {});
    }).toThrow(BadRequestError);
  });

  it('should use default column names if no mapping provided', () => {
    const dataToUpdate = { firstName: 'John', age: 30 };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, {});

    expect(setCols).toBe('"firstName"=$1, "age"=$2');
    expect(values).toEqual(['John', 30]);
  });

  it('should handle mapping for all properties', () => {
    const dataToUpdate = { firstName: 'John', age: 30 };
    const jsToSql = { firstName: 'first_name', age: 'user_age' };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(setCols).toBe('"first_name"=$1, "user_age"=$2');
    expect(values).toEqual(['John', 30]);
  });

  it('should ignore properties not present in dataToUpdate', () => {
    const dataToUpdate = { firstName: 'John' };
    const jsToSql = { firstName: 'first_name', age: 'user_age' };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(setCols).toBe('"first_name"=$1');
    expect(values).toEqual(['John']);
  });
});
