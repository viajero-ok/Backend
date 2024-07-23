import * as bcryptjs from 'bcryptjs';

const saltOrRounds = 10;

const plainToHash = async (plainText: string) => {
	return await bcryptjs.hash(plainText, saltOrRounds);
};

const comparePlainToHash = async (plainText: string, hashText: string) => {
	return await bcryptjs.compare(plainText, hashText);
};

export { plainToHash, comparePlainToHash };
