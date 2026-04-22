const API_URL = 'https://student-login-demo.onrender.com/api';

// Utility for showing alerts
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;
    
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    
    setTimeout(() => {
        alertBox.className = 'alert hidden';
    }, 4000);
}

// Utility to set loading state
function setLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    const textSpan = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');
    
    if (isLoading) {
        btn.disabled = true;
        textSpan.classList.add('hidden');
        loader.classList.remove('hidden');
    } else {
        btn.disabled = false;
        textSpan.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

// === Register Flow ===
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        setLoading('registerBtn', true);

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (!data.success) {
                showAlert(data.error);
                setLoading('registerBtn', false);
                return;
            }

            // Success, save token and redirect
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } catch (err) {
            showAlert('Server error. Please try again later.');
            setLoading('registerBtn', false);
        }
    });
}

// === Login Flow ===
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        setLoading('loginBtn', true);

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (!data.success) {
                showAlert(data.error);
                setLoading('loginBtn', false);
                return;
            }

            // Success, save token and redirect
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } catch (err) {
            showAlert('Server error. Please try again later.');
            setLoading('loginBtn', false);
        }
    });
}

// === Dashboard Flow ===
if (window.location.pathname.includes('dashboard.html')) {
    const token = localStorage.getItem('token');
    
    // Protect route
    if (!token) {
        window.location.href = 'index.html';
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // Fetch personal details
    async function fetchMyDetails() {
        try {
            const res = await fetch(`${API_URL}/students/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (!data.success) {
                localStorage.removeItem('token');
                window.location.href = 'index.html';
                return;
            }

            document.getElementById('studentName').textContent = data.data.name;
            document.getElementById('studentEmail').textContent = data.data.email;
            document.getElementById('studentJoined').textContent = new Date(data.data.createdAt).toLocaleDateString();
        } catch (err) {
            console.error('Error fetching details', err);
        }
    }

    // Fetch all students list
    async function fetchAllStudents() {
        try {
            const res = await fetch(`${API_URL}/students`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                const tbody = document.getElementById('studentsBody');
                data.data.forEach(student => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${new Date(student.createdAt).toLocaleDateString()}</td>
                    `;
                    tbody.appendChild(tr);
                });
                
                document.getElementById('tableLoader').classList.add('hidden');
                document.getElementById('studentsTable').classList.remove('hidden');
            }
        } catch (err) {
            console.error('Error fetching students', err);
        }
    }

    fetchMyDetails();
    fetchAllStudents();
}
