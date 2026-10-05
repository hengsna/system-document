// API URL
// const API_BASE = 'https://m-and-e-backend.onrender.com/api';
const API_BASE = '/api';

// State
let users = [];
let roles = [];
let locationsDB = {};

let selectedProvince = null;
let selectedDistrict = null;
let selectedCommune = null;

// Initialize
async function initAdmin() {
    await fetchRoles();
    await fetchUsers();
    await fetchLocations();
    renderProvinces();
}

async function fetchUsers() {
    const res = await fetch(`${API_BASE}/users`);
    users = await res.json();
    renderUsers();
}

async function fetchRoles() {
    const res = await fetch(`${API_BASE}/roles`);
    roles = await res.json();
    renderRoles();
}

async function fetchLocations() {
    const res = await fetch(`${API_BASE}/locations`);
    locationsDB = await res.json();
    renderProvinces();
    if(selectedProvince) onProvinceChange(selectedProvince);
}

// ---------------- USER MANAGEMENT ----------------
function renderUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    users.forEach(u => {
        let permsHtml = '';
        if (u.permissions && u.permissions.length > 0) {
            u.permissions.forEach(p => {
                permsHtml += `<span class="px-2 py-0.5 mr-1 rounded bg-indigo-50 text-indigo-600 text-[10px] font-semibold border border-indigo-100">${p}</span>`;
            });
        } else {
            permsHtml = '<span class="text-xs text-slate-400">None</span>';
        }
        
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50/50">
                <td class="px-6 py-4 font-medium text-slate-900">${u.name}</td>
                <td class="px-6 py-4">${u.email}</td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">${u.role || 'None'}</span>
                </td>
                <td class="px-6 py-4">${permsHtml}</td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium ${u.status === 'Active' ? 'text-emerald-700 bg-emerald-100' : 'text-slate-700 bg-slate-200'}">${u.status}</span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="editUser(${u.id})" class="text-slate-400 hover:text-indigo-600 mx-1"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteUser(${u.id})" class="text-slate-400 hover:text-rose-600 mx-1"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function populateRoleDropdown() {
    const select = document.getElementById('user-role');
    select.innerHTML = '<option value="">Select Role...</option>';
    roles.forEach(r => {
        select.innerHTML += `<option value="${r.name}">${r.name}</option>`;
    });
}

function openUserModal(id = null) {
    populateRoleDropdown();
    // clear checkboxes
    ['perm-create', 'perm-edit', 'perm-delete', 'perm-modify'].forEach(i => document.getElementById(i).checked = false);

    if (id) {
        const u = users.find(x => x.id === id);
        document.getElementById('user-modal-title').innerText = 'Edit User';
        document.getElementById('user-id').value = u.id;
        document.getElementById('user-name').value = u.name;
        document.getElementById('user-email').value = u.email;
        document.getElementById('user-role').value = u.role;
        document.getElementById('user-status').value = u.status;
        
        if (u.permissions) {
            u.permissions.forEach(p => {
                const cb = document.getElementById('perm-' + p.toLowerCase());
                if(cb) cb.checked = true;
            });
        }
    } else {
        document.getElementById('user-modal-title').innerText = 'Add User';
        document.getElementById('user-id').value = '';
        document.getElementById('user-name').value = '';
        document.getElementById('user-email').value = '';
    }
    document.getElementById('user-modal').classList.remove('hidden');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
}

async function saveUser() {
    const id = document.getElementById('user-id').value;
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    const status = document.getElementById('user-status').value;

    const permissions = [];
    ['perm-create', 'perm-edit', 'perm-delete', 'perm-modify'].forEach(i => {
        const cb = document.getElementById(i);
        if(cb.checked) permissions.push(cb.value);
    });

    if (!name || !email) return alert('Name and email required');

    await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, email, role, status, permissions})
    });
    
    closeUserModal();
    await fetchUsers();
}

function editUser(id) { openUserModal(id); }
async function deleteUser(id) {
    if(confirm('Delete this user?')) {
        await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
        await fetchUsers();
    }
}

// ---------------- ROLE MANAGEMENT ----------------
function renderRoles() {
    const grid = document.getElementById('roles-grid');
    grid.innerHTML = '';
    roles.forEach(r => {
        grid.innerHTML += `
            <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-slate-800 text-lg">${r.name}</h4>
                        <div>
                            <button onclick="editRole(${r.id})" class="text-slate-400 hover:text-indigo-600 ml-2"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="deleteRole(${r.id})" class="text-slate-400 hover:text-rose-600 ml-2"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <p class="text-sm text-slate-500 mt-1 mb-4">${r.description || ''}</p>
                </div>
                <div class="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                    <span class="text-slate-500">${r.count || 0} Users</span>
                    <button onclick="openAssignRoleModal('${r.id}', '${r.name}')" class="text-indigo-600 font-medium hover:underline">Edit Permissions</button>
                </div>
            </div>
        `;
    });
}

function openRoleModal(id = null) {
    if (id) {
        const r = roles.find(x => x.id === id);
        document.getElementById('role-modal-title').innerText = 'Edit Role';
        document.getElementById('role-id').value = r.id;
        document.getElementById('role-name').value = r.name;
        document.getElementById('role-desc').value = r.description;
    } else {
        document.getElementById('role-modal-title').innerText = 'Create Role';
        document.getElementById('role-id').value = '';
        document.getElementById('role-name').value = '';
        document.getElementById('role-desc').value = '';
    }
    document.getElementById('role-modal').classList.remove('hidden');
}

function closeRoleModal() {
    document.getElementById('role-modal').classList.add('hidden');
}

async function saveRole() {
    const id = document.getElementById('role-id').value;
    const name = document.getElementById('role-name').value;
    const desc = document.getElementById('role-desc').value;

    if (!name) return alert('Role name required');

    await fetch(`${API_BASE}/roles`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, desc})
    });
    
    closeRoleModal();
    await fetchRoles();
}

function editRole(id) { openRoleModal(id); }
async function deleteRole(id) {
    if(confirm('Delete this role?')) {
        await fetch(`${API_BASE}/roles/${id}`, { method: 'DELETE' });
        await fetchRoles();
    }
}


// ---------------- LOCATION HIERARCHY ----------------

function renderProvinces() {
    const select = document.getElementById('select-province');
    select.innerHTML = '<option value="">Select Province...</option>';
    Object.keys(locationsDB).forEach(key => {
        select.innerHTML += `<option value="${key}">${locationsDB[key].name}</option>`;
    });
    if (selectedProvince) select.value = selectedProvince;
}

function onProvinceChange(val) {
    selectedProvince = val;
    selectedDistrict = null;
    selectedCommune = null;
    renderDistricts();
    renderCommunes();
    renderVillages();
}

function renderDistricts() {
    const select = document.getElementById('select-district');
    select.innerHTML = '<option value="">Select District...</option>';
    if (!selectedProvince || !locationsDB[selectedProvince]) {
        select.disabled = true;
        return;
    }
    select.disabled = false;
    const districts = locationsDB[selectedProvince].districts;
    Object.keys(districts).forEach(key => {
        select.innerHTML += `<option value="${key}">${districts[key].name}</option>`;
    });
    if (selectedDistrict) select.value = selectedDistrict;
}

function onDistrictChange(val) {
    selectedDistrict = val;
    selectedCommune = null;
    renderCommunes();
    renderVillages();
}

function renderCommunes() {
    const select = document.getElementById('select-commune');
    select.innerHTML = '<option value="">Select Commune...</option>';
    if (!selectedDistrict || !locationsDB[selectedProvince].districts[selectedDistrict]) {
        select.disabled = true;
        return;
    }
    select.disabled = false;
    const communes = locationsDB[selectedProvince].districts[selectedDistrict].communes;
    Object.keys(communes).forEach(key => {
        select.innerHTML += `<option value="${key}">${communes[key].name}</option>`;
    });
    if (selectedCommune) select.value = selectedCommune;
}

function onCommuneChange(val) {
    selectedCommune = val;
    renderVillages();
}

function renderVillages() {
    const select = document.getElementById('select-village');
    select.innerHTML = '<option value="">Select Village...</option>';
    if (!selectedCommune || !locationsDB[selectedProvince].districts[selectedDistrict].communes[selectedCommune]) {
        select.disabled = true;
        return;
    }
    select.disabled = false;
    const villages = locationsDB[selectedProvince].districts[selectedDistrict].communes[selectedCommune].villages;
    villages.forEach(v => {
        select.innerHTML += `<option value="${v}">${v}</option>`;
    });
}

function openLocationModal(type) {
    if (type === 'district' && !selectedProvince) return alert('Select a Province first!');
    if (type === 'commune' && !selectedDistrict) return alert('Select a District first!');
    if (type === 'village' && !selectedCommune) return alert('Select a Commune first!');

    document.getElementById('location-type').value = type;
    document.getElementById('location-modal-title').innerText = 'Add ' + type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('location-name').value = '';
    document.getElementById('location-modal').classList.remove('hidden');
}

function closeLocationModal() {
    document.getElementById('location-modal').classList.add('hidden');
}

async function saveLocation() {
    const type = document.getElementById('location-type').value;
    const name = document.getElementById('location-name').value;
    if (!name) return alert('Name required');
    
    let parentName = null;
    if (type === 'district') parentName = locationsDB[selectedProvince].name;
    else if (type === 'commune') parentName = locationsDB[selectedProvince].districts[selectedDistrict].name;
    else if (type === 'village') parentName = locationsDB[selectedProvince].districts[selectedDistrict].communes[selectedCommune].name;

    try {
        const res = await fetch(`${API_BASE}/locations`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ type, name, parentName })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to save location.');
        }
    } catch (err) {
        alert(err.message);
        return;
    }
    
    closeLocationModal();
    await fetchLocations(); // Reload from DB

    const id = name.toLowerCase().replace(/\s+/g, '_');
    
    if (type === 'province') {
        selectedProvince = id;
        renderProvinces();
        onProvinceChange(id);
    } else if (type === 'district') {
        selectedDistrict = id;
        renderDistricts();
        onDistrictChange(id);
    } else if (type === 'commune') {
        selectedCommune = id;
        renderCommunes();
        onCommuneChange(id);
    } else if (type === 'village') {
        renderVillages();
        document.getElementById('select-village').value = name;
    }
}

// Call init when script loads
initAdmin();

// ---------------- ASSIGN ROLES MODAL ----------------
function openAssignRoleModal(roleId, roleName) {
    const role = roles.find(r => r.id == roleId);
    if (!role) return;
    
    document.getElementById('assign-role-title').innerText = 'Assign Users to: ' + roleName;
    document.getElementById('assign-role-id').value = roleId;
    
    const list = document.getElementById('assign-users-list');
    list.innerHTML = '';
    
    users.forEach(u => {
        // user is checked if they belong to this role
        const isChecked = (u.role === roleName) ? 'checked' : '';
        list.innerHTML += `<label class="flex items-center p-2 hover:bg-slate-50 rounded"><input type="checkbox" value="${u.id}" class="mr-3 text-indigo-600 rounded border-slate-300 role-assign-cb" ${isChecked}> ${u.name} (${u.email})</label>`;
    });
    
    document.getElementById('assign-role-modal').classList.remove('hidden');
}

function closeAssignRoleModal() {
    document.getElementById('assign-role-modal').classList.add('hidden');
}

async function saveRoleUsers() {
    const roleId = document.getElementById('assign-role-id').value;
    const checkboxes = document.querySelectorAll('.role-assign-cb:checked');
    const userIds = Array.from(checkboxes).map(cb => cb.value);
    
    await fetch(API_BASE + '/roles/' + roleId + '/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ user_ids: userIds })
    });
    
    closeAssignRoleModal();
    await fetchRoles();
    await fetchUsers();
}

// ---------------- AUTHENTICATION ----------------
async function handleLogin() {
    const btn = document.getElementById('login-btn');
    const err = document.getElementById('login-error');
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    
    btn.innerText = 'Signing in...';
    btn.disabled = true;
    err.classList.add('hidden');
    
    try {
        const res = await fetch(API_BASE + '/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: user, password: pass})
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            // Login successful
            document.getElementById('login-overlay').classList.add('hidden');
        } else {
            // Login failed
            err.innerText = data.message || 'Invalid credentials';
            err.classList.remove('hidden');
            btn.innerText = 'Sign In';
            btn.disabled = false;
        }
    } catch (error) {
        err.innerText = 'Connection error. Make sure the backend is running.';
        err.classList.remove('hidden');
        btn.innerText = 'Sign In';
        btn.disabled = false;
    }
}

// ---------------- INDICATOR MODULE ----------------
let indicators = [];
let programs = [];

async function fetchPrograms() {
    try {
        const res = await fetch(API_BASE + '/programs');
        programs = await res.json();
    } catch (e) {
        console.error(e);
    }
}

async function fetchIndicators() {
    try {
        const res = await fetch(API_BASE + '/indicators');
        indicators = await res.json();
        renderIndicators();
    } catch (e) {
        console.error(e);
    }
}

function renderIndicators() {
    const tbody = document.getElementById('indicators-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (indicators.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-8 text-center text-slate-500">No indicators found. Create one!</td></tr>';
        return;
    }
    
    indicators.forEach(ind => {
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 font-medium text-slate-800">${ind.program_name || 'N/A'}</td>
                <td class="px-6 py-4">${ind.indicator}</td>
                <td class="px-6 py-4">${ind.baseline || '-'}</td>
                <td class="px-6 py-4">${ind.target || '-'}</td>
                <td class="px-6 py-4">${ind.data_source || '-'}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        ${ind.frequency || '-'}
                    </span>
                </td>
                <td class="px-6 py-4">${ind.role_name || 'Unassigned'}</td>
                <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editIndicator('${ind._id}')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="deleteIndicator('${ind._id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function openIndicatorModal() {
    document.getElementById('indicator-id').value = '';
    document.getElementById('indicator-name').value = '';
    document.getElementById('indicator-baseline').value = '';
    document.getElementById('indicator-target').value = '';
    document.getElementById('indicator-source').value = '';
    document.getElementById('indicator-frequency').value = 'Monthly';
    
    populateIndicatorDropdowns();
    document.getElementById('indicator-modal-title').innerText = 'Add Indicator';
    document.getElementById('indicator-modal').classList.remove('hidden');
}

function closeIndicatorModal() {
    document.getElementById('indicator-modal').classList.add('hidden');
}

function populateIndicatorDropdowns() {
    const progSelect = document.getElementById('indicator-program');
    progSelect.innerHTML = '<option value="">Select Program...</option>';
    programs.forEach(p => {
        progSelect.innerHTML += `<option value="${p._id}">${p.name}</option>`;
    });

    const roleSelect = document.getElementById('indicator-role');
    roleSelect.innerHTML = '<option value="">Select Role...</option>';
    roles.forEach(r => {
        roleSelect.innerHTML += `<option value="${r._id}">${r.name}</option>`;
    });
}

async function saveIndicator() {
    const id = document.getElementById('indicator-id').value;
    const program_id = document.getElementById('indicator-program').value;
    const indicator = document.getElementById('indicator-name').value;
    const baseline = document.getElementById('indicator-baseline').value;
    const target = document.getElementById('indicator-target').value;
    const data_source = document.getElementById('indicator-source').value;
    const frequency = document.getElementById('indicator-frequency').value;
    const responsible_role_id = document.getElementById('indicator-role').value;

    if (!indicator) return alert('Indicator name is required');

    await fetch(API_BASE + '/indicators', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id || undefined,
            program_id: program_id || null,
            indicator,
            baseline,
            target,
            data_source,
            frequency,
            responsible_role_id: responsible_role_id || null
        })
    });
    
    closeIndicatorModal();
    await fetchIndicators();
}

function editIndicator(id) {
    const ind = indicators.find(i => i._id === id);
    if (!ind) return;
    
    populateIndicatorDropdowns();
    
    document.getElementById('indicator-id').value = ind._id;
    document.getElementById('indicator-program').value = ind.program_id || '';
    document.getElementById('indicator-name').value = ind.indicator;
    document.getElementById('indicator-baseline').value = ind.baseline || '';
    document.getElementById('indicator-target').value = ind.target || '';
    document.getElementById('indicator-source').value = ind.data_source || '';
    document.getElementById('indicator-frequency').value = ind.frequency || 'Monthly';
    document.getElementById('indicator-role').value = ind.responsible_role_id || '';
    
    document.getElementById('indicator-modal-title').innerText = 'Edit Indicator';
    document.getElementById('indicator-modal').classList.remove('hidden');
}

async function deleteIndicator(id) {
    if (!confirm('Delete this indicator?')) return;
    await fetch(API_BASE + '/indicators/' + id, { method: 'DELETE' });
    await fetchIndicators();
}

// Hook into initAdmin to fetch indicators and programs
const originalInit = initAdmin;
initAdmin = async function() {
    await originalInit();
    await fetchPrograms();
    await fetchIndicators();
}
