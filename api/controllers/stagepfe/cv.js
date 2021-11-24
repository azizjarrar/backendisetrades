const multer = require("multer");
const query=require('./db_query');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/pdf");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + ".pdf");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype === "application/pdf") callback(null, true);
    else callback(new Error("cannot upload File type"), false);
  },
});

exports.add=(req, res) => {
  const uploadResult = upload.single("fichier_cv");
  uploadResult(req, res, (err)=> {
    console.log(req.file)
    if (!err) {
        const {
          specialite,
          id_etudiant,
          id_competence,
          id_experience,
        } = req.body;
        const path = "http://localhost:5010/uploads/pdf/" + req.file.filename;
        const sql = `INSERT INTO cv (specialite,id_etudiant,id_competence,id_experience,fichier_cv) VALUES ?`;
  
        const values = [
          [specialite,
          id_etudiant,
          id_competence,
          id_experience,
          path]
        ];
        query.sql_request(sql,[values],res);           
      } else {
        res.status(404).json({
          err: true,
          message: "File not uploaded",
        });
      }
    });
  }

  module.exports.getAll=(req,res)=>{
    const sql=`SELECT * FROM cv`;
    query.sql_request(sql,null,res);            
};

module.exports.getOne=(req,res)=>{
  const id=req.params.id;
  const sql=`SELECT * FROM cv where id_cv = ?`;
  query.sql_request(sql,[id],res);        
};


exports.update=(req, res) => {
    const uploadResult = upload.single("fichier_cv");
    let sql=``;
    let values=[];
    uploadResult(req, res,  (err) =>{
      const{specialite,id_competence,id_experience,id_cv}=req.body;

      if(req.file){
        const path = "http://localhost:5010/uploads/pdf/" + req.file.filename;
        if (!err) {
          sql=`UPDATE cv SET specialite = ?, id_competence = ?,id_experience = ?,fichier_cv=? WHERE id_cv = ? `;
          values=[
            specialite,
            // id_etudiant,
            id_competence,
            id_experience,
            path,
            id_cv];
            query.sql_request(sql,values,res);           
      }
      else {
        res.status(404).json({
          err: true,
          message: "File not uploaded",
        });
      }

    }
    
    else{
      sql=`UPDATE cv SET specialite = ?, id_competence = ?,id_experience = ? WHERE id_cv = ? `;
          values=[specialite,
            // id_etudiant,
            id_competence,
            id_experience,
            id_cv];
            query.sql_request(sql,values,res);        
    }
  });
 
};

module.exports.delete=(req,res)=>{
  const id=req.params.id;
  const sql=`DELETE FROM cv where id_cv = ?`;
  query.sql_request(sql,[id],res);        
};

