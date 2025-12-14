import { Model } from '../Model';

import { expect, test, describe } from "bun:test";


describe('Model Entity', () => {
    const validProps = {
        id: '123',
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxOutputTokens: 100,
    };

    test('should create a valid model', () => {
        const model = new Model(validProps);
        expect(model).toBeInstanceOf(Model);
        expect(model.id).toBe(validProps.id);
    });

    test('should throw error if id is missing', () => {
        expect(() => new Model({ ...validProps, id: '' })).toThrow('Model id is required');
    });

    test('should throw error if provider is missing', () => {
        expect(() => new Model({ ...validProps, provider: '' })).toThrow('Model provider is required');
    });

    test('should throw error if model name is missing', () => {
        expect(() => new Model({ ...validProps, model: '' })).toThrow('Model name is required');
    });

    test('should throw error if temperature is out of range', () => {
        expect(() => new Model({ ...validProps, temperature: -1 })).toThrow('Temperature must be between 0 and 1');
        expect(() => new Model({ ...validProps, temperature: 1.1 })).toThrow('Temperature must be between 0 and 1');
    });

    test('should throw error if maxOutputTokens is invalid', () => {
        expect(() => new Model({ ...validProps, maxOutputTokens: 0 })).toThrow('Max output tokens must be greater than 0');
    });

    describe('withConfig', () => {
        test('should create a new model with updated config', () => {
            const model = new Model(validProps);
            const updated = model.withConfig({ temperature: 1.0 });

            expect(updated).toBeInstanceOf(Model);
            expect(updated.id).toBe(model.id);
            expect(updated.temperature).toBe(1.0);
            expect(updated.model).toBe(model.model); // should remain unchanged
        });
    });
});
