import { expect, describe, it } from '@jest/globals';

const test = () => {
    return true;
};

describe('Test', () => {
    it('should return true', () => {
        expect(test()).toBe(true);
    });


})

