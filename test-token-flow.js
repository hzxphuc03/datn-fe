// TEST TOKEN FLOW - Paste vào Console (F12) để test
console.log('=== TOKEN FLOW TEST ===');

// 1. Check token existence
const token = localStorage.getItem('jwtToken');
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

console.log('1. Token Check:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 50) + '...' : 'NO TOKEN'
});

console.log('2. User Info:', {
    id: userInfo.id,
    username: userInfo.username,
    role: userInfo.role,
    email: userInfo.email
});

// 2. Decode token manually
if (token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(base64));
        console.log('3. Decoded Token:', decoded);

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        const isExpired = decoded.exp < now;
        console.log('4. Token Expiration:', {
            exp: decoded.exp,
            now: now,
            isExpired: isExpired,
            expiresIn: Math.floor((decoded.exp - now) / 60) + ' minutes'
        });
    } catch (e) {
        console.error('Failed to decode token:', e);
    }
}

// 3. Test API call
if (token && userInfo.id) {
    console.log('5. Testing API call...');
    fetch(`http://localhost:8080/api/gio_hang/get_so_luong/${userInfo.id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(r => {
            console.log('API Response Status:', r.status);
            return r.json();
        })
        .then(data => console.log('✅ API Success:', data))
        .catch(err => console.error('❌ API Error:', err));
} else {
    console.error('❌ Cannot test API: Missing token or user ID');
}

console.log('=== END TEST ===');
