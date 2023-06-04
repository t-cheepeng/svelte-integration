import type { AccountActivity, Trade } from "$lib/types/model";

export function isTrade(activity: AccountActivity): activity is Trade {
	return (activity as Trade).tradeTs !== undefined;
}
