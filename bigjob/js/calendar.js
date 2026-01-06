// Vérifier l'authentification au chargement
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.replace("index.html");
} else {
    // Afficher les informations de l'utilisateur
    document.getElementById("userEmail").textContent = currentUser.email;

    // Afficher les liens de navigation selon le rôle
    if (currentUser.role === "moderator" || currentUser.role === "admin") {
        document.getElementById("backofficeLink").style.display = "block";
    }
    if (currentUser.role === "admin") {
        document.getElementById("adminLink").style.display = "block";
    }

    // Charger les demandes de l'utilisateur
    displayMyRequests();
}

// Fonction pour afficher les demandes de l'utilisateur
function displayMyRequests() {
    const presences = JSON.parse(localStorage.getItem("presences")) || [];
    const myRequests = presences.filter(p => p.email === currentUser.email);
    const tbody = document.getElementById("myRequests");
    tbody.innerHTML = "";

    if (myRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Aucune demande pour le moment</td></tr>';
        return;
    }

    myRequests.forEach(request => {
        const row = document.createElement("tr");
        
        let statusBadge = "";
        if (request.status === "pending") {
            statusBadge = '<span class="badge bg-warning">En attente</span>';
        } else if (request.status === "accepted") {
            statusBadge = '<span class="badge bg-success">Acceptée</span>';
        } else if (request.status === "refused") {
            statusBadge = '<span class="badge bg-danger">Refusée</span>';
        }

        row.innerHTML = `
            <td>${request.date}</td>
            <td>${statusBadge}</td>
            <td>${request.reason || "-"}</td>
        `;
        tbody.appendChild(row);
    });
}

// Fonction pour soumettre une demande de présence
function submitPresenceRequest(e) {
    e.preventDefault();

    const dateInput = document.getElementById("presenceDate").value;
    const reasonInput = document.getElementById("reason").value;

    if (!dateInput) {
        alert("Veuillez sélectionner une date");
        return;
    }

    const selectedDate = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Vérifier que la date n'est pas dans le passé
    if (selectedDate < today) {
        alert("Vous ne pouvez pas faire une demande pour une date passée");
        return;
    }

    const presences = JSON.parse(localStorage.getItem("presences")) || [];

    // Vérifier si l'utilisateur a déjà une demande pour cette date
    const existingRequest = presences.find(p => 
        p.email === currentUser.email && p.date === dateInput
    );

    if (existingRequest) {
        alert("Vous avez déjà une demande pour cette date");
        return;
    }

    // Créer la nouvelle demande
    const newRequest = {
        id: Date.now().toString(),
        email: currentUser.email,
        date: dateInput,
        reason: reasonInput,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    presences.push(newRequest);
    localStorage.setItem("presences", JSON.stringify(presences));

    // Réinitialiser le formulaire
    document.getElementById("presenceForm").reset();

    // Rafraîchir l'affichage
    displayMyRequests();

    alert("Demande envoyée avec succès !");
}

// Attacher l'événement au formulaire
document.getElementById("presenceForm").addEventListener("submit", submitPresenceRequest);

// Définir la date minimale à aujourd'hui
document.getElementById("presenceDate").min = new Date().toISOString().split("T")[0];
