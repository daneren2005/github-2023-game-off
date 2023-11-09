export default function formatNumber(value: number, allowDecimalForSmallNubmers = true) {
	if(value > 1_000_000_000) {
		return `${(value / 1_000_000_000).toFixed(2)}b`;
	} else if(value > 1_000_000) {
		return `${(value / 1_000_000).toFixed(2)}m`;
	} else if(value > 1_000) {
		return `${(value / 1_000).toFixed(2)}k`;
	} else if(allowDecimalForSmallNubmers) {
		// NOTE: Do not use toFixed because we want to display as 40 and not 40.0 if there is no decimal place
		return Math.round(value * 10) / 10
	} else {
		return Math.floor(value);
	}
}