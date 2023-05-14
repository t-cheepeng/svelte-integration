import moment from 'moment';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Expected format: "YYYY-MM-DDTHH:MM:ss.mmm[+|-]HH:MM"
export const convertFullTimestampToReadableDateTime = (fullTimestamp: string) => {
	const datetime = moment(fullTimestamp);
	return datetime.format('Do MMMM YYYY, HH:mm:ss');
};

export const convertCentsToDollarAndCents = (cents: number) => {
	if (cents >= 0) {
		return `${Math.floor(cents / 100)}.${cents % 100}`;
	} else {
		const inverted = -cents;
		return `-${Math.floor(inverted / 100)}.${inverted % 100}`;
	}
};

export const convertMillicentsToDollarAndCents = (millicents: number) => {
	const absVal = Math.abs(millicents);
	const dollar = Math.floor(millicents / 100 / 1000);
	const cents = absVal - dollar * 100 * 1000;
	return `${millicents < 0 ? '-' : ''}${dollar}.${cents.toString().padStart(5, "0")}`;
};

export const getMillicentsFromCents = (cents: string): number => {
	const allowedCentString = cents.substring(0, 5);
	let millicents = 0;
	for (let i = 0; i < 5; i++) {
		const charAt = allowedCentString.charAt(i);
		const parsed = Number.parseInt(charAt);
		if (!isNaN(parsed)) {
			millicents += parsed * Math.pow(10, 4 - i);
		}
	}
	return millicents;
};

export const getMillicentsFromDollarAndCents = (dollarAndCents: string) => {
	const [dollar, cents] = dollarAndCents.split('.');
	return (
		Number.parseInt(dollar) * 100 * 1000 + (cents === undefined ? 0 : getMillicentsFromCents(cents))
	);
};
