const {connection} = require('../server');

const path = (app) =>{
    app.get('/membres', (req, res) =>{
        connection.query('SELECT * FROM membres',
        [],
        (err, results) =>{
            if (err) throw err;
            res.json(results)
        })
    })

    app.get('/membres/:id', (req, res) =>{
        connection.query('SELECT * FROM membres WHERE id_membres = ?;',
        [id_membres],
        (err, results) =>{
            if (err) throw err;
            res.json(results)
        })
    })

app.post('/membres', (req, res) => {
  const { nom_membres, prenom_membres, tel, mail, certificat_medical, card_number, card_date, CCV, password} = req.body;
  
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
    }
    
      
module.exports = path;
