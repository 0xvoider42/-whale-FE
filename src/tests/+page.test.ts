import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Page from '../routes/+page.svelte';
import { fetchPrice } from '$lib/index';

vi.mock('$lib/index', () => ({
    fetchPrice: vi.fn()
}));

describe('Crypto Price Tracker', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.mocked(fetchPrice).mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render initial state correctly', () => {
        render(Page);
        expect(screen.getByText('Crypto Price Tracker')).toBeTruthy();
        expect(screen.getByText('Switch to USDT_TON')).toBeTruthy();
        expect(screen.getByText('Fetching latest price...')).toBeTruthy();
    });


    it('should switch pairs when button is clicked', async () => {
        vi.mocked(fetchPrice).mockResolvedValueOnce('1.234');
        const { component } = render(Page);
        
        await tick();
        
        const switchButton = screen.getByText('Switch to USDT_TON');
        await fireEvent.click(switchButton);
        
        expect(fetchPrice).toHaveBeenCalledWith('USDT_TON');
    });
});