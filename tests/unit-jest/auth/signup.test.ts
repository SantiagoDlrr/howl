import { passwordSchema } from '../../../src/app/utils/schemas/authSchemas';
import { expect, describe, it } from '@jest/globals';

describe('Password validation', () => {
    it('should return true for valid password', () => {
        const password = 'Abcde123#';
        const result = passwordSchema.safeParse(password);
        expect(result.success).toBe(true);
    });

    it('should return false for password with < 8 chars', () => {
        const password = 'Ab1#';
        const result = passwordSchema.safeParse(password);
        if (result.success) {
            throw new Error('Expected validation to fail');
        }
        const errorMessage = result.error.errors
            .map((error) => error.message)
            .join('. ');

        expect(errorMessage).toBe('La contraseña debe tener al menos 8 caracteres');
        expect(result.success).toBe(false);
    });

    it('should return false for password without uppercase letter', () => {
        const password = 'abcde123#';
        const result = passwordSchema.safeParse(password);
        if (result.success) {
            throw new Error('Expected validation to fail');
        }
        const errorMessage = result.error.errors
            .map((error) => error.message)
            .join('. ');
        expect(errorMessage).toBe('La contraseña debe tener al menos una letra mayúscula');
        expect(result.success).toBe(false);
    });

    it('should return false for password without number', () => {
        const password = 'Abcdefgh#';
        const result = passwordSchema.safeParse(password);
        if (result.success) {
            throw new Error('Expected validation to fail');
        }
        const errorMessage = result.error.errors
            .map((error) => error.message)  
            .join('. ');
        expect(errorMessage).toBe('La contraseña debe tener al menos un número');
        expect(result.success).toBe(false);
    });

    it('should return false for password without special character', () => {
        const password = 'Abcde1234';
        const result = passwordSchema.safeParse(password);
        if (result.success) {
            throw new Error('Expected validation to fail');
        }
        const errorMessage = result.error.errors
            .map((error) => error.message)
            .join('. ');
        expect(errorMessage).toBe('La contraseña debe tener al menos un caracter especial');
        expect(result.success).toBe(false);
    });

});
