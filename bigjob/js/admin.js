// Vérifier l'authentification et les droits admin
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
    window.location.replace("index.html");
} else {
    // Afficher les informations de l'utilisateur
    document.getElementById("userEmail").textContent = currentUser.email;

    // Charger les utilisateurs et les statistiques
    displayUsers();
    updateStatistics();
}

// Fonction pour afficher les statistiques
function updateStatistics() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const presences = JSON.parse(localStorage.getItem("presences")) || [];

    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === "admin").length;
    const totalModerators = users.filter(u => u.role === "moderator").length;
    const totalStudents = users.filter(u => u.role === "etudiant").length;
    
    const pendingRequests = presences.filter(p => p.status === "pending").length;
    const acceptedRequests = presences.filter(p => p.status === "accepted").length;

    document.getElementById("totalUsers").textContent = totalUsers;
    document.getElementById("totalAdmins").textContent = totalAdmins;
    document.getElementById("totalModerators").textContent = totalModerators;
    document.getElementById("totalStudents").textContent = totalStudents;
    document.getElementById("pendingRequests").textContent = pendingRequests;
    document.getElementById("acceptedRequests").textContent = acceptedRequests;
}

// Fonction pour afficher tous les utilisateurs
function displayUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const tbody = document.getElementById("usersTable");
    tbody.innerHTML = "";

    users.forEach((user, index) => {
        const row = document.createElement("tr");
        
        let roleBadge = "";
        if (user.role === "admin") {
            roleBadge = '<span class="badge bg-danger">Administrateur</span>';
        } else if (user.role === "moderator") {
            roleBadge = '<span class="badge bg-warning">Modérateur</span>';
        } else {
            roleBadge = '<span class="badge bg-info">Étudiant</span>';
        }

        // Ne pas permettre de modifier son propre compte
        const isSelf = user.email === currentUser.email;
        const roleSelect = isSelf ? 
            `<span class="text-muted">${roleBadge} (Vous)</span>` :
            `
            <select class="form-select form-select-sm" id="role-${index}" onchange="updateRole(${index})">
                <option value="etudiant" ${user.role === "etudiant" ? "selected" : ""}>Étudiant</option>
                <option value="moderator" ${user.role === "moderator" ? "selected" : ""}>Modérateur</option>
                <option value="admin" ${user.role === "admin" ? "selected" : ""}>Administrateur</option>
            </select>
            `;

        const deleteButton = isSelf ?
            '' :
            `<button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">
                <i class="bi bi-trash"></i> Supprimer
            </button>`;

        row.innerHTML = `
            <td>${user.email}</td>
            <td>${roleBadge}</td>
            <td>${roleSelect}</td>
            <td>${deleteButton}</td>
        `;
        tbody.appendChild(row);
    });
}

// Fonction pour mettre à jour le rôle d'un utilisateur
function updateRole(index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newRole = document.getElementById(`role-${index}`).value;
    
    if (confirm(`Voulez-vous vraiment changer le rôle de ${users[index].email} ?`)) {
        users[index].role = newRole;
        localStorage.setItem("users", JSON.stringify(users));
        displayUsers();
        updateStatistics();
        alert("Rôle modifié avec succès");
    } else {
        displayUsers(); // Réinitialiser l'affichage
    }
}

// Fonction pour supprimer un utilisateur
function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (confirm(`Voulez-vous vraiment supprimer l'utilisateur ${users[index].email} ?`)) {
        const deletedEmail = users[index].email;
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        
        // Supprimer aussi les demandes de présence de cet utilisateur
        let presences = JSON.parse(localStorage.getItem("presences")) || [];
        presences = presences.filter(p => p.email !== deletedEmail);
        localStorage.setItem("presences", JSON.stringify(presences));
        
        displayUsers();
        updateStatistics();
        alert("Utilisateur supprimé avec succès");
    }
}
