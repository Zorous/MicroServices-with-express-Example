const express = require("express");
const app = express();
const PORT = 4001;
const mongoose = require("mongoose");
const Commande = require("./Commande");
const axios = require('axios');


//Connexion à la base de données
mongoose.set('strictQuery', true);
mongoose.connect(
"mongodb://localhost:27017/commande-service",
{
useNewUrlParser: true,
useUnifiedTopology: true,
},
);
app.use(express.json());

//Calcul du prix total d'une commande en passant en paramètre untableau des produits
function prixTotal(produits) {
let total = 0;
for (let t = 0; t < produits.length; ++t) {
total += produits[t].prix;
}
console.log("prix total :" + total);
return total;
}


//Cette fonction envoie une requête http au service produit pour récupérer le tableau des produits qu'on désire commander (en se basant sur leurs ids)
async function httpRequest(ids) {
try {
const URL = "http://localhost:4000/produit/acheter"
const response = await axios.post(URL, { ids: ids }, {
headers: {
'Content-Type': 'application/json'
}
});


//appel de la fonction prixTotal pour calculer le prix total de la commande en se basant sur le résultat de la requête
http
return prixTotal(response.data);
} catch (error) {
console.error(error);
}
}


app.post("/commande/ajouter",isAuthenticated, async (req, res, next) => {
// Création d'une nouvelle commande dans la collection commande
const { ids, email_utilisateur } = req.body;
httpRequest(req.body.ids).then(total => {
const newCommande = new Commande({
ids,
email_utilisateur: email_utilisateur,
prix_total: total,
});
newCommande.save()
.then(commande => res.status(201).json(commande))
.catch(error => res.status(400).json({ error }));
});
});


app.listen(PORT, () => {
console.log(`Commande-Service at ${PORT}`);
});