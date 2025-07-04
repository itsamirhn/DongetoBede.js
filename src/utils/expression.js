import { Parser } from 'expr-eval';

class ExpressionEvaluator {
    constructor() {
        this.parser = new Parser();
    }

    eval(expression) {
        try {
            if (!expression || typeof expression !== 'string') {
                throw new Error('Invalid expression');
            }

            // Clean the expression
            const cleanExpression = expression.trim();

            // Parse and evaluate the expression
            const expr = this.parser.parse(cleanExpression);
            const result = expr.evaluate();

            // Check if result is a valid number
            if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid expression result');
            }

            return result;
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }
}

export default ExpressionEvaluator; 