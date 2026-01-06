// Initialisation des données au premier chargement
if (!localStorage.getItem("users")) {
    const initialData = {
        "users": [
            {
                "id": "admin",
                "email": "admin@laplateforme.io",
                "password": "admin",
                "role": "admin"
            },
            {
                "id": "moderator",
                "email": "moderateur@laplateforme.io",
                "password": "modo",
                "role": "moderator"
            }
        ],
        "presences": []
    };
    localStorage.setItem("users", JSON.stringify(initialData.users));
    localStorage.setItem("presences", JSON.stringify(initialData.presences));
}

// Fonction d'inscription
function register(email, password, confirmPassword) {
    // Vérification du domaine email
    if (!email.endsWith("@laplateforme.io")) {
        return { success: false, message: "Seules les adresses @laplateforme.io sont autorisées" };
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
        return { success: false, message: "Les mots de passe ne correspondent pas" };
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
        return { success: false, message: "Le mot de passe doit contenir au moins 6 caractères" };
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Vérification si l'utilisateur existe déjà
    if (users.some(u => u.email === email)) {
        return { success: false, message: "Cet email est déjà utilisé" };
    }

    // Création du nouvel utilisateur
    const newUser = {
        id: Date.now().toString(),
        email: email,
        password: password,
        role: "etudiant"
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "Inscription réussie ! Vous pouvez maintenant vous connecter" };
}

// Fonction de connexion
function login(email, password) {
    let users;
    try {
        const usersData = localStorage.getItem("users");
        users = usersData ? JSON.parse(usersData) : [];
        
        // Vérifier que users est bien un tableau
        if (!Array.isArray(users)) {
            console.error("Les données utilisateurs ne sont pas un tableau. Réinitialisation...");
            // Réinitialiser les données
            const initialData = {
                "users": [
                    {
                        "id": "admin",
                        "email": "admin@laplateforme.io",
                        "password": "admin",
                        "role": "admin"
                    },
                    {
                        "id": "moderator",
                        "email": "moderateur@laplateforme.io",
                        "password": "modo",
                        "role": "moderator"
                    }
                ]
            };
            users = initialData.users;
            localStorage.setItem("users", JSON.stringify(users));
        }
    } catch (error) {
        console.error("Erreur lors de la lecture des utilisateurs:", error);
        users = [];
    }
    
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: "Email ou mot de passe incorrect" };
    }

    // Sauvegarder l'utilisateur connecté
    localStorage.setItem("currentUser", JSON.stringify(user));

    return { success: true, user: user };
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem("currentUser");
    window.location.replace("index.html");
}

// Vérifier si l'utilisateur est connecté
function checkAuth() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.replace("index.html");
        return null;
    }
    return JSON.parse(currentUser);
}
