import * as validator from 'validator';
import { Transform } from 'class-transformer';

export function SanitizeXSSTransform() {
	return Transform(({ value }) => {
		if (typeof value === 'string') {
			// Sanitiza el valor para evitar XSS
			return validator.escape(value);
		}
		return value;
	});
}
