
import { AwesomeLibrary } from './AwesomeLibrary';
import { expect } from 'chai';

describe('AwesomeLibrary', () => {

  it('should create an instance', () => {
    const value = new AwesomeLibrary();
    expect(value).instanceOf(AwesomeLibrary);
  });

});
