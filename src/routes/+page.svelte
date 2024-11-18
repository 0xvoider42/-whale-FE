<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fetchPrice, fetchHistoricalPrice } from '$lib/index';

	const REFRESH_INTERVAL = 30000; // 30 seconds
	const PAIRS = {
		TON_USDT: 'TON_USDT',
		USDT_TON: 'USDT_TON'
	} as const;

	type TokenPair = keyof typeof PAIRS;
	interface PriceState {
		value: string | null;
		error: string | null;
	}

	let tokenPair: TokenPair = PAIRS.TON_USDT;
	let priceState: PriceState = { value: null, error: null };
	let isLoading = true;
	let refreshInterval: ReturnType<typeof setInterval>;
	let historicalPrices: Array<{ timestamp: string; price: string }> = [];
	let startDate: string = '';
	let endDate: string = '';
	let noPricesMessage: string = '';

	async function getPrice() {
		isLoading = true;
		priceState.error = null;

		try {
			const result = await fetchPrice(tokenPair);
			priceState = { value: result, error: null };
		} catch (error) {
			priceState = {
				value: null,
				error: error instanceof Error ? error.message : 'Error fetching price'
			};
		} finally {
			isLoading = false;
		}
	}

	async function getHistoricalPrice() {
		try {
			const prices = await fetchHistoricalPrice(tokenPair, startDate, endDate);
			historicalPrices = prices;
		} catch (error) {
			console.error('Error fetching historical prices:', error);
			noPricesMessage = 'Error fetching historical prices. Please try again.';
		}
	}

	function switchPair() {
		tokenPair = tokenPair === PAIRS.TON_USDT ? PAIRS.USDT_TON : PAIRS.TON_USDT;
		getPrice();
	}

	function setupRefreshInterval() {
		refreshInterval = setInterval(getPrice, REFRESH_INTERVAL);
	}

	onMount(() => {
		getPrice();
		setupRefreshInterval();
	});

	onDestroy(() => {
		if (refreshInterval) clearInterval(refreshInterval);
	});
</script>

<div class="container">
	<h1 class="title">Crypto Price Tracker</h1>
	<button
		type="button"
		class="btn variant-filled-primary rounded-full transition-all hover:scale-105"
		on:click={switchPair}
		disabled={isLoading}
	>
		Switch to {tokenPair === PAIRS.TON_USDT ? 'USDT_TON' : 'TON_USDT'}
	</button>

	<div class="card p-6 mt-8 shadow-lg hover:shadow-xl transition-shadow">
		<section class="price-section">
			{#if isLoading}
				<div class="loading-spinner">
					<span class="loader"></span>
					<span class="loading-text">Fetching latest price...</span>
				</div>
			{:else if priceState.error}
				<div class="error-message">
					<span class="error-icon">⚠️</span>
					<span>{priceState.error}</span>
					<button class="btn variant-ghost-error rounded-full text-sm" on:click={getPrice}>
						Retry
					</button>
				</div>
			{:else}
				<div class="price-display">
					<span class="pair-label">{tokenPair}</span>
					<span class="price-value">
						{priceState.value ? `$${priceState.value}` : 'N/A'}
					</span>
					<button class="btn variant-ghost rounded-full text-sm" on:click={getPrice}>
						Fetch Latest Price
					</button>
					<span class="update-time">Auto-updates every 30s</span>
				</div>
			{/if}
		</section>
		<section>
			<div class="date-inputs">
				<div class="row">
					<div class="six columns">
						<label for="start-date">Start Date:</label>
						<input type="date" id="start-date" bind:value={startDate} class="u-full-width" />
					</div>

					<div class="six columns">
						<label for="end-date">End Date:</label>
						<input type="date" id="end-date" bind:value={endDate} class="u-full-width" />
					</div>
				</div>
			</div>

			<button type="button" class="button-primary" on:click={getHistoricalPrice}>
				Fetch Historical Prices
			</button>

			{#if noPricesMessage}
				<div class="notification" style="color: red; margin-top: 10px;">
					{noPricesMessage}
				</div>
			{/if}

			{#if historicalPrices.length > 0}
				<div class="historical-prices">
					<h2>Historical Prices</h2>
					<ul>
						{#each historicalPrices as { timestamp, price }}
							<li>{timestamp}: <span>${price}</span></li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>
	</div>
</div>
