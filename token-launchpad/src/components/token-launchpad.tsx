import React, { useState } from 'react';

export default function TokenLaunchpad() {
    const [tokenDetails, setTokenDetails] = useState({
        name: '',
        symbol: '',
        decimals: '9',
        supply: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTokenDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically connect to a wallet adapter and execute the smart contract
        console.log("Creating token with payload:", tokenDetails);
        alert(`Initiating creation of ${tokenDetails.name} (${tokenDetails.symbol})`);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Token Launchpad</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="name" style={{ fontWeight: '500' }}>Token Name</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={tokenDetails.name}
                        onChange={handleChange}
                        placeholder="e.g., Solana"
                        required
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="symbol" style={{ fontWeight: '500' }}>Token Symbol</label>
                    <input 
                        type="text" 
                        id="symbol"
                        name="symbol"
                        value={tokenDetails.symbol}
                        onChange={handleChange}
                        placeholder="e.g., SOL"
                        required
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="decimals" style={{ fontWeight: '500' }}>Decimals</label>
                    <input 
                        type="number" 
                        id="decimals"
                        name="decimals"
                        value={tokenDetails.decimals}
                        onChange={handleChange}
                        min="0"
                        max="18"
                        required
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="supply" style={{ fontWeight: '500' }}>Total Supply</label>
                    <input 
                        type="number" 
                        id="supply"
                        name="supply"
                        value={tokenDetails.supply}
                        onChange={handleChange}
                        placeholder="e.g., 1000000000"
                        min="1"
                        required
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>

                <button 
                    type="submit"
                    style={{
                        marginTop: '10px',
                        padding: '12px',
                        backgroundColor: '#14F195', // A vibrant crypto-style color
                        color: '#000',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Create Token
                </button>
            </form>
        </div>
    );
}