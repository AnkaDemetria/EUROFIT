const {connection} = require('../server');


    // certaines données sont des données sensibles  { nom_membres, prenom_membres, tel, mail, certificat_medical, ) donc au lieu de tout sélectionner dans ma requete je vais sélectionner : le nom, prénom, tél, mail.

    // d autres données ne m'intéressent pas vraiment: id abonnement, id club, id medecin, id adresse, je préfère avoir le nomdu club par exemple
const path = (app) =>{
  app.get('/membres', (req, res)=>{
    connection.query('SELECT m.nom_membres, m.prenom_membres, m.tel, m.mail, c.nom_club, a.titre, med.nom_medecin, med.prenom_medecin FROM membres m INNER JOIN club c ON m.id_club = c.id_club INNER JOIN abonnement a ON m.id_abonnement = a.id_abonnement INNER JOIN medecin med ON m.id_adresse = med.id_adresse;', 
    [],
    (err, results)=>{
      if (err) throw err;
      res.json(results)
    })
  })


    app.get('/membres/:id', (req, res) =>{
      const id_membres = req.params.id;
        connection.query('SELECT * FROM membres WHERE id_membres = ?;',
        [id_membres],
        (err, results) =>{
            if (err) throw err;
            res.json(results)
        })
    })


      // EXERCICE: Chercher tous les membres qui ont le prénom Umbre avec la commande like (sans afficher le n°carte de crédit ni les infos sensibles)
    app.get('/membres/nom/:nom', (req, res) =>{
        const nom = req.params.nom;
        connection.query('SELECT m.nom_membres, m.prenom_membres, m.tel, m.mail, c.nom_club, a.titre FROM membres m INNER JOIN club c ON m.id_club = c.id_club INNER JOIN abonnement a ON m.id_abonnement = a.id_abonnement WHERE prenom_membres LIKE  ?;',
        [nom],
        (err, results) =>{
            if (err) throw err;
            res.json(results)
        })
    })

app.post('/membres', (req, res) => {
  const {nom_membres, prenom_membres, tel, mail, certificat_medical, card_number, card_date, CCV, password} = req.body;
  
  if (!nom_membres) {
    res.status(400).json({ error: 'Le nom est obligatoire' });
    return;
  }

  connection.query(
    'INSERT INTO membres(nom_membres, prenom_membres, tel, mail, certificat_medical, card_number, card_date, CCV, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nom_membres, prenom_membres, tel, mail, certificat_medical, card_number, card_date, CCV, password],
    (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
      } else {
        res.status(201).json({ message: 'membre créé avec succès' });
      }
    }
  )
});
    
   

    app.delete('/membres/:id', (req, res) => {
        const id_membres = req.params.id;
        connection.query('DELETE FROM membres WHERE id_membres = ?', [id_membres], (err, results) => {
          if (err) throw err;
          if(results.affectedRows === 0) {
            res.status(404).send('membres non trouvé');
          } else {
            res.status(200).json({ message: 'membre supprimé avec succès'});
          }
        });
      });
    
// PATCH 1ERE METHODE
    app.patch('/membres/:id', (req, res) => {
      const { nom_membres, prenom_membres, tel, mail, certificat_medical, card_number, card_date, CCV, password, id_club, id_abonnement, id_medecin, id_adresse } = req.body;
      const id_membres = req.params.id;
      if (!nom_membres) {
        res.status(400).json({ error: 'Le nom_membres est obligatoire' });
        return;
      }
      connection.query(
        'UPDATE membres SET nom_membres=?, prenom_membres=?, tel=?, mail=?, certificat_medical=?, card_number=?, card_date=?, CCV=?, password=?, id_club=?,id_abonnement=?,id_medecin=?,id_adresse=?  WHERE id_membres= ?',
        [nom_membres, prenom_membres, tel, mail, certificat_medical, card_number, card_date, CCV, password, id_club, id_abonnement, id_medecin,id_adresse,id_membres],
        (error, data) => {
          if (error) {
            console.error(error);
            res.status(500).send('Erreur du serveur');
          } else {
            res.status(201).json({ message: 'modification avec succès' });
          }
        }
      )
    });
      
  }


module.exports = path;
