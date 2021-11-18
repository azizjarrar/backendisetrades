const query=require('./db_query');
const multer = require("multer");
const path = require('path');

const videoStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/videos");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
         + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
    fileSize: 50000000 //  50 MB
    },
    fileFilter(req, file, cb) {
      // upload only mp4 and mkv format
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
         return cb(new Error('Please upload a video'))
      }
      cb(undefined, true)
   }
})

exports.add=(req,res)=>{
    //uploading video
    const uploadResult = videoUpload.single("my_video");

    uploadResult(req, res, function (err) {
        const{id_etudiant,id_offre_stage}=req.body;
        if(req.file){
            if (!err) {
                const pathVideo   = "http://localhost:5010/uploads/videos/" + req.file.filename;
                const sql=`INSERT INTO demande_stage_entreprise (id_etudiant,id_offre_stage, pres_video) VALUES ?`;
                const values=[
                    [id_etudiant, id_offre_stage, pathVideo]
                ];
                query.sql_request(sql,[values],res);      
            } else {
                res.status(404).json({
                    err: true,
                    message: "video not uploaded",
                });
            }
        }
        else{
            const sql=`INSERT INTO demande_stage_entreprise (id_etudiant,id_offre_stage) VALUES ?`;
            const values=[
                [id_etudiant,id_offre_stage]
            ];
            query.sql_request(sql,[values],res); 
        }
  });
}


exports.getAll=(req,res)=>{
    const{id_etudiant,statut}=req.body;
    let sql;
    let values=[];
    if(!statut){

        sql=` SELECT * from etudiant e join user u join demande_stage_entreprise d join offre_stage o
         join responsable_entreprise resp join entreprise ent join etat_demande_stage_entreprise etatdemond
          on e.id_user=u.id_user and e.id_etudiant=d.id_etudiant and d.id_offre_stage=o.id_offre_stage and
           o.id_responsable_entreprise=resp.id_responsable_entreprise and resp.id_entreprise=ent.id_entreprises 
           and etatdemond.id_etat_demande_stage_entreprise=d.id_etat_demande_stage_entreprise WHERE e.id_etudiant=?`;
         values=[id_etudiant];

        }else{
        sql=`SELECT * from etudiant e join user u join demande_stage_entreprise d join offre_stage o
        join responsable_entreprise resp join entreprise ent join etat_demande_stage_entreprise etatdemond
         on e.id_user=u.id_user and e.id_etudiant=d.id_etudiant and d.id_offre_stage=o.id_offre_stage and
          o.id_responsable_entreprise=resp.id_responsable_entreprise and resp.id_entreprise=ent.id_entreprises 
          and etatdemond.id_etat_demande_stage_entreprise=d.id_etat_demande_stage_entreprise WHERE e.id_etudiant= ? and etatdemond.id_etat_demande_stage_entreprise = ?`;
        values=[id_etudiant,statut];
    }   
    query.sql_request(sql,values,res);    
}

module.exports.getAllDemandesEtudiant=(req,res)=> {
    const {id,year,etat}=req.params;
    const values=[id,etat,"%"+year+"%"];
        const sql=`select * from etudiant e join domaine join entreprise ent join 
        responsable_entreprise resp JOIN offre_stage o 
        join demande_stage_entreprise dse 
        join etat_demande_stage_entreprise edse 
        on e.id_etudiant=dse.id_etudiant and dse.id_offre_stage=o.id_offre_stage 
        AND o.id_responsable_entreprise=resp.id_responsable_entreprise 
        AND resp.id_entreprise=ent.id_entreprises 
        AND dse.id_etat_demande_stage_entreprise=edse.id_etat_demande_stage_entreprise
        AND domaine.id_domaine=ent.id_domaine
        WHERE e.id_etudiant= ?
        and dse.id_etat_demande_stage_entreprise=? and dse.date_demande LIKE ?`
        query.sql_request(sql,values,res);
};

module.exports.getAllPostulationsEtudiant=(req,res)=> {
    const id=req.params.id;
    const sql=`SELECT d.*,o.*,domaine.libelle from etudiant e join responsable_entreprise resp 
    JOIN entreprise join offre_stage o on resp.id_entreprise=entreprise.id_entreprises
     and resp.id_responsable_entreprise=o.id_responsable_entreprise JOIN domaine on
      entreprise.id_domaine=domaine.id_domaine JOIN demande_stage_entreprise 
    d on e.id_etudiant=d.id_etudiant and d.id_offre_stage=o.id_offre_stage WHERE e.id_etudiant= ?`; 
        query.sql_request(sql,[id],res);    
};