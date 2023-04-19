const {connection} = require('../server');

const path = (app) =>{
//on veut les reponses (rep) au format json pr devenir un objet javascript et on envoie results(resultats), pour faire des requetes preparées on ajoute [].Une requête préparée ou requête paramétrable est utilisée pour exécuter la même requête plusieurs fois, avec une grande efficacité et protège des injections SQL.L'exécution d'une requête préparée se déroule en deux étapes : la préparation et l'exécution.
    app.get('/abonnement', (req, res) =>{
        connection.query('SELECT * FROM abonnement',
        [],
        (err, results) =>{
            if (err) throw err;
            res.json(results)
        })
    })

// on bind l'id(valeur dynamique qui s'incrémente dans l'adresse url suite à la requete et qui n'est pas codé de base par nous) sur la méthode get, binder c est retourné une valeur qui ne vient pas d'une requete get mais d'un bind, car il n'y a ni clé ni valeur, mais c'est une valeur dynamique dc une url dynamique et pas une url fixe. c'est une page gérée dynamiquement et pas codé avec une clé et une valeur (?q)
    app.get('/abonnement/:id', (req, res) =>{
        connection.query('SELECT * FROM abonnement WHERE id_abonnement = ?;',
        [id_abonnement],
        (err, results) =>{
            if (err) throw err;
            res.json(results)
        })
    })

//METHODE POST: pour mettre à jour ou insérer une ressource.
app.post('/abonnement', (req, res) => {
  const { titre, tout_club, toutes_salles, tout_pays, reduc_complement, reduc_medecine, reduc_coach, tarif } = req.body;
  
  if (!titre) {
    res.status(400).json({ error: 'Le titre est obligatoire' });
    return;
  }

  connection.query(
    'INSERT INTO abonnement(titre, tout_club, toutes_salles, tout_pays, reduc_complement, reduc_medecine, reduc_coach, tarif) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
    [titre, tout_club, toutes_salles, tout_pays, reduc_complement, reduc_medecine, reduc_coach, tarif],
    (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
      } else {
        res.status(201).json({ message: 'Abonnement créé avec succès' });
      }
    }
  )
});
    
   

    // METHODE DELETE: on supprime l'id abonnement qui a le chiffre qu'on définira, ça supprimera la ligne
    app.delete('/abonnement/:id', (req, res) => {
        const id_abonnement = req.params.id;
        connection.query('DELETE FROM abonnement WHERE id_abonnement = ?', [id_abonnement], (err, results) => {
          if (err) throw err;
          if(results.affectedRows === 0) {
            res.status(404).send('Abonnement non trouvé');
          } else {
            res.status(200).json({ message: 'Abonnement supprimé avec succès'});
          }
        });
      });
      
      // METHODE PATCH et PUT: La méthode PATCH d'une requête HTTP applique des modifications partielles à une ressource. La méthode HTTP PUT crée une nouvelle ressource ou remplace une représentation de la ressource ciblée par le contenu de la requête. La différence entre PUT et POST tient au fait que PUT est une méthode idempotente.
      app.patch('/abonnement/', (req, res) => {
        const query = 'UPDATE abonnement SET titre = ?, tout_club = ?, toutes_salles = ?, tout_pays = ?, reduc_complement = ?, reduc_medecine = ?, reduc_coach = ?, tarif = ? WHERE id_abonnement = ?';
        const params = [req.body.titre, req.body.tout_club, req.body.toutes_salles, req.body.tout_pays, req.body.reduc_complement, req.body.reduc_medecine, req.body.reduc_coach, req.body.tarif, req.body.id_abonnement];
        connection.query(query, params, (error, result) => {
          if(error) throw error;
          res.send({
            ok: true,
          });
        });
      });
    
      
    }
      
module.exports = path;
