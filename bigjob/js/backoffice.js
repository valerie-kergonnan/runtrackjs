// Vérifier l'authentification et les droits
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role === "etudiant") {
    window.location.replace("index.html");
} else {
    // Afficher les informations de l'utilisateur
    document.getElementById("userEmail").textContent = currentUser.email;

    // Afficher le lien admin si l'utilisateur est admin
    if (currentUser.role === "admin") {
        document.getElementById("adminLink").style.display = "block";
    }

    // Charger toutes les demandes
    displayAllRequests();
}

// Fonction pour afficher toutes les demandes
function displayAllRequests() {
    const presences = JSON.parse(localStorage.getItem("presences")) || [];
    const tbody = document.getElementById("requests");
    tbody.innerHTML = "";

    if (presences.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucune demande pour le moment</td></tr>';
        return;
    }

    presences.forEach((request, index) => {
        const row = document.createElement("tr");
        
        let statusBadge = "";
        if (request.status === "pending") {
            statusBadge = '<span class="badge bg-warning">En attente</span>';
        } else if (request.status === "accepted") {
            statusBadge = '<span class="badge bg-success">Acceptée</span>';
        } else if (request.status === "refused") {
            statusBadge = '<span class="badge bg-danger">Refusée</span>';
        }

        // Vérifier si la date est passée
        const requestDate = new Date(request.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPastDate = requestDate < today;

        let actions = "";
        if (request.status === "pending" && !isPastDate) {
            actions = `
                <button class="btn btn-success btn-sm" onclick="updateStatus(${index}, 'accepted')">
                    <i class="bi bi-check-lg"></i> Accepter
                </button>
                <button class="btn btn-danger btn-sm" onclick="updateStatus(${index}, 'refused')">
                    <i class="bi bi-x-lg"></i> Refuser
                </button>
            `;
        } else if (isPastDate) {
            actions = '<span class="text-muted">Date expirée</span>';
        } else {
            actions = '<span class="text-muted">Déjà traitée</span>';
        }

        row.innerHTML = `
            <td>${request.email}</td>
            <td>${request.date}</td>
            <td>${request.reason || "-"}</td>
            <td>${statusBadge}</td>
            <td>${actions}</td>
        `;
        tbody.appendChild(row);
    });
}

// Fonction pour mettre à jour le statut d'une demande
function updateStatus(index, newStatus) {
    const presences = JSON.parse(localStorage.getItem("presences")) || [];
    
    if (presences[index]) {
        presences[index].status = newStatus;
        presences[index].updatedAt = new Date().toISOString();
        presences[index].updatedBy = currentUser.email;
        
        localStorage.setItem("presences", JSON.stringify(presences));
        displayAllRequests();
        
        const statusText = newStatus === "accepted" ? "acceptée" : "refusée";
        alert(`Demande ${statusText} avec succès`);
    }
}
