const sql=require('../../../../db_connection');

const checkEtudiant = (id_etudiant,id_seance, callback) => {
    let date_ob= new Date();
    let currentDate=date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1 - 0) + "-" + date_ob.getDate();
    sql.query(`select * from presence_etudiant where id_etudiant= ${id_etudiant} and time= '${currentDate}' and id_seance = '${id_seance}' `,(err,res)=>{
        if(err){
            console.log("error:",err);
            callback(err,null);
            return;
        }else{
            if(res.length!==0){
                callback(null,false);
                return;
            }else{
                callback(null,true);
                return;
            }
        }
    });
}

const updatePresenceEtudiant = (etudiant, id_enseignement, id_seance, callback) => {
    if(id_enseignement==="Data Enseignement Not Found"){
        callback(null,"Data Enseignement Not Found");
        return;
    }
    let date_ob= new Date();
    let currentDate=date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1 - 0) + "-" + date_ob.getDate();
    sql.query(`INSERT INTO presence_etudiant (id_presence, id_etudiant, id_enseignement, id_etat_presence_etd, localisation, time, id_seance) VALUES (NULL, '${etudiant.id_etudiant}', '${id_enseignement[0].id_enseignement}', '2', '', '${currentDate}', '${id_seance}')`,(err,res)=>{
        if(err){
            console.log("error:",err);
            callback(err,null);
            return;
        }else{
            callback(null,res);
            return;
        }
    });

}

const getListEtudiantCurrentClasse = (id_classe, dataSemestre, callback) => {

    sql.query(`select * from inscription where id_classe=${id_classe} and date_inscription between '${dataSemestre[0].date_debut_annee_univ.toISOString().substring(0, 10)}' and '${dataSemestre[0].date_fin_annee_univ.toISOString().substring(0, 10)}'`, (err, res) => {
        if (err) {
            console.log("error:", err);
            callback(err,null);
            return;
        } else {
            callback(null,res);
            return;
        }
    });
}

const getDateSemestre = (data, callback) => {
    sql.query(`select * from matiere m , semestre s where id_matiere=${data} and m.id_semestre = s.id_semestre`, (err, res) => {
        if (err) {
            console.log("error:", err);
            callback(err,null);
            return;
        } else {
            callback(null,res);
            return;
        }
    });
}

const updateEnseignement = (resultQrCode, callback) => {
    if(resultQrCode==="Data Enseignement Not Found"){
        callback(null,"Data Enseignement Not Found");
        return;
    }
    //let date_ob = new Date();
    //let resultDate = date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1 ) + "-" + date_ob.getDate();
    let resultDate = getCurrentDate();
    
    console.log('******************');
    console.log(getCurrentDate());
    let resultData = `${resultQrCode[0].id_enseignement}-${resultQrCode[0].id_enseignant}-${resultQrCode[0].id_salle}-${resultQrCode[0].id_seance}-${resultQrCode[0].id_matiere}-${resultQrCode[0].id_enseignant}-${resultQrCode[0].id_classe}-${resultQrCode[0].id_statut_enseignement}-${resultDate}`;
    sql.query(`UPDATE enseignement SET qr_code = '${resultData}' WHERE id_enseignement = ${resultQrCode[0].id_enseignement}`, (err, res) => {
        if (err) {
            console.log("error:", err);
            callback(err,null);
            return;
        } else {
            callback(null,resultData);
            return;
        }

    });

}



const dataForQrCode = (id_enseignant, id_seance, callback) => {

    //old condition
    //sql.query(`select * from enseignement where id_enseignant = ${id_enseignant} and id_seance = ${id_seance} and id_classe=${id_classe} and id_matiere=${id_matiere}`, (err, res) => {
    
    //new condition with date
    //sql.query(`select * from enseignement where id_enseignant = ${id_enseignant} and  jour='${getCurrentNumberDay()}' and id_seance=${id_seance}`, (err, res) => {
        
    sql.query(`select * from enseignement where id_enseignant = ${id_enseignant} and  jour='lundi' and id_seance=${id_seance}`, (err, res) => {
        if (err) {
            console.log("error :", err);
            callback(err,null);
            return;
        }
        if (res[0] !== undefined) {
            callback(null,res);
            return;
        }
        callback(null,"Data Enseignement Not Found");
        return;
    });
}

const create = (result) => {
    let date_ob = new Date();
    const heure = date_ob.getHours() + ":" + date_ob.getMinutes();
    console.log(heure);
    //sql.query(`SELECT id_seance FROM seance WHERE '${heure}' BETWEEN date_debut_seance and date_fin_seance`, (err, res) => {
    sql.query(`SELECT id_seance FROM seance WHERE '9:15' BETWEEN date_debut_seance and date_fin_seance`, (err, res) => {
        if (err) {
            console.log("error:", err);
            result(err, null);
            return;
        }

        if (res[0] !== undefined) {
            result(null, res[0].id_seance);
            return;
        }
        result({
            kind: "list empty"
        }, null);
        return;
    });



};


const  getCurrentNumberDay=()=>{
    let weekdays=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
    let date_ob = new Date();
    let r = date_ob.getDay();   
   return weekdays[r-1];
}

const getCurrentDate=()=>{
    let date_ob = new Date();
    let resultDate = date_ob.getFullYear() + "-" + ((date_ob.getMonth()+1<10)?'0'+(date_ob.getMonth()+1):date_ob.getMonth()+1 ) + "-" + date_ob.getDate();
    
    return resultDate;
}


module.exports = {
    create,
    dataForQrCode,
    updateEnseignement,
    getDateSemestre,
    getListEtudiantCurrentClasse,
    updatePresenceEtudiant,
    checkEtudiant,
    getCurrentNumberDay,
    getCurrentDate
};