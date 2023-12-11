/*

	DMN Parser
	Transform a .dmn into an usable JS object, using dmn-moddle library.

*/

import DmnModdle from 'dmn-moddle';

export const parseDMN = async ( xmlString: string ): Promise<any> => {
	const moddle = new DmnModdle();
	return moddle.fromXML( xmlString );
};
