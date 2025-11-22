const API_URL = 'http://localhost:5000/api';

async function testAI() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testuser4@example.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.session?.access_token || loginData.token; // Handle both Supabase and custom token formats if any

        if (!token) {
            // If using Supabase Auth, the session object contains the token
            console.log('Login response:', loginData);
            throw new Error('No token found in login response');
        }

        console.log('Login successful. Token obtained.');

        // 2. Call AI Chat
        console.log('Sending AI request...');
        const aiRes = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: 'Create a 5-day trip to Tokyo for Pulkit Test'
            })
        });

        if (!aiRes.ok) {
            throw new Error(`AI request failed: ${aiRes.status} ${await aiRes.text()}`);
        }

        const aiData = await aiRes.json();
        console.log('AI Response:', JSON.stringify(aiData, null, 2));

    } catch (err) {
        console.error('Test failed:', err);
    }
}

testAI();
