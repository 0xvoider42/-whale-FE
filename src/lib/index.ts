export async function fetchPrice(tokenPair: string) {
    try {
        const response = await fetch(`http://localhost:3000/crypto-price/${tokenPair}`);
        if (!response.ok) {
            throw new Error(`Error fetching price: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        return data.price;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchHistoricalPrice(tokenPair: string, startDate: string, endDate: string) {
    try {
        const response = await fetch(`http://localhost:3000/crypto-price/historical?pair=${tokenPair}&startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) {
            throw new Error(`Error fetching historical price: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}