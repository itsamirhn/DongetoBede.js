import { Parser } from 'expr-eval';
import { ERRORS } from '../constants.js';

const parser = new Parser();

function evaluateExpression(expression) {
    try {
        if (!expression || typeof expression !== 'string') {
            throw new Error(ERRORS.INVALID_EXPRESSION);
        }

        const cleanExpression = expression.trim();
        const expr = parser.parse(cleanExpression);
        const result = expr.evaluate();

        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            throw new Error(ERRORS.INVALID_EXPRESSION);
        }

        return result;
    } catch (error) {
        throw new Error(ERRORS.INVALID_EXPRESSION);
    }
}

export default evaluateExpression; 