const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4000;
const mongoose = require("mongoose");
const Produit = require("./Produit");

app.use(express.json());


//Connection à la base de données MongoDB « publication-servicedb »
//(Mongoose créera la base de données s'il ne le trouve pas)
mongoose.set('strictQuery', true);

mongoose.connect(
"mongodb://localhost:27017/produit-service",
{
useNewUrlParser: true,
useUnifiedTopology: true,
}
);


//L'ajout
app.post("/produit/ajouter", (req, res, next) => {
const { nom, description, prix } = req.body;
const newProduit = new Produit({
nom,
description,
prix
});



//La méthode save() renvoie une Promise.
//Ainsi, dans le bloc then(), nous renverrons une réponse de réussite avec un code 201 de réussite.
//Dans le bloc catch () , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.

newProduit.save()
.then(produit => res.status(201).json(produit))
.catch(error => res.status(400).json({ error }));
});



app.get("/produit/acheter", (req, res, next) => {
const { ids } = req.body;
Produit.find({ _id: { $in: ids } })
.then(produits => res.status(201).json(produits))
.catch(error => res.status(400).json({ error }));
});


app.listen(PORT, () => {
console.log(`Listening to Product-Service at http:/localhost:${PORT}`);
});



//Calcul du prix total d'une commande en passant en paramètre un tableau des produits
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

