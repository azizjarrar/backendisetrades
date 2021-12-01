const sql=require('../../../../db_connection');

const getUser = (user, result) => {
    sql.query(`select e.id_etudiant , i.id_classe from user u , etudiant e , inscription i
     where e.id_user = u.id_user and i.id_etudiant = e.id_etudiant and u.email = '${user.body.email}' and u.password = '${user.body.password}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res !== undefined) {
            result(null, res);
            return;
        }


    });
}


const getCountAbsence = (listMatiere, user, result) => {
    sql.query(`select m.id_matiere,m.charge_horaire , m.libelle libelle ,(select count(p.id_etudiant) from presence_etudiant p 
    where e.id_enseignement = p.id_enseignement and p.id_etat_presence_etd=2 and p.id_etudiant=${user.body.id_etudiant}) nb_abs from 
    enseignement e , matiere m where e.id_classe= ${user.body.id_classe} and m.id_matiere=e.id_matiere and
    (select count(p.id_etudiant) from presence_etudiant p where e.id_enseignement = p.id_enseignement and p.id_etudiant=${user.body.id_etudiant})>0
    `, (err, res) => {
        if (err) {
            console.log('error in data');
            result(err, null);
            return;
        } else {
            if (res != undefined) {

                let arrayResult = [];
                for (let index = 0; index < listMatiere.length; index++) {
                    arrayResult.push({
                        "id_matiere": listMatiere[index].id_matiere,
                        "libelle": listMatiere[index].libelle,
                        "charge_horaire": listMatiere[index].charge_horaire,
                        "nb_abs": 0
                    });
                }

                for (let index = 0; index < res.length; index++) {
                    for (let j = 0; j < arrayResult.length; j++) {
                        if (arrayResult[j].id_matiere == res[index].id_matiere) {
                            arrayResult[j].nb_abs = res[index].nb_abs;
                        }
                    }

                }

                result(null, arrayResult);
                return;
            }
        }
    });
}

const getListMatiere = (user, result) => {
    sql.query(`select DISTINCT(select m.id_matiere from matiere m where e.id_matiere=m.id_matiere) id_matiere,
        (select m.libelle from matiere m where e.id_matiere=m.id_matiere) libelle, (select m.charge_horaire from matiere m where e.id_matiere=m.id_matiere)charge_horaire from enseignement e
        where e.id_classe= ${user.body.id_classe}`, (err, res) => {

        /* sql.query(`select m.id_matiere , m.libelle libelle ,(select count(p.id_etudiant) from presence_etudiant p where e.id_enseignement = p.id_enseignement and p.id_etudiant=5) nb_abs from enseignement e , matiere m where e.id_classe= 1 and m.id_matiere=e.id_matiere and (select count(p.id_etudiant) from presence_etudiant p where e.id_enseignement = p.id_enseignement and p.id_etudiant=5)>0
        `,(err,res)=>{
         */


        if (err) {
            console.log('error in data');
            result(err, null);
            return;
        } else {
            if (res !== undefined) {
                result(null, res);
                return;
            }
        }

    });
}

const getListDetaillMatiere = (user, result) => {
    /*sql.query(`select * from presence_etudiant p , enseignement e , matiere m where id_etudiant=${user.body.id_etudiant} and 
    id_etat_presence_etd=2 and p.id_enseignement= e.id_enseignement and m.id_matiere = e.id_matiere 
    and e.id_classe=${user.body.id_classe}`,(err,res)=>{
        if(err){*/
    sql.query(`select * from presence_etudiant p , enseignement e , matiere m where id_etudiant=${user.body.id_etudiant} and 
    id_etat_presence_etd=2 and p.id_enseignement= e.id_enseignement and m.id_matiere = e.id_matiere and e.id_matiere=${user.body.id_matiere}
    and e.id_classe=${user.body.id_classe}`, (err, res) => {
        if (err) {
            console.log(err.message);
            result(err, null);
            return;
        } else {
            if (res.length > 0) {
                //console.log("time "+res[5].time);
                res.forEach(element => {
                    //element.time = element.time.toISOString().substring(0, 10);
                    //console.log(element.time.toISOString().substring(0,10));
                    
                    element.time = element.time.toISOString().substring(0,10);
                });
                //console.log("time "+res[5].time);

                result(null, res);
                return;
            }
        }

    });
}

function checkDataQr(dataQrCode) {
    
    nbSiparitor=0;
    for (let i = 0; i < dataQrCode.length; i++) {
    
        if(dataQrCode[i]=='-'){
            nbSiparitor++;
        }
        
    }
    if(nbSiparitor!=10){
        return false;
    }

    let arrayDataQrCode = dataQrCode.split('-');
    for (let i = 0; i < arrayDataQrCode.length; i++) {
        if(isNaN(arrayDataQrCode[i])){
            return false
        }
    
    }
    return true;
}

const scanneQrCode = (id_etudaint, dataQrCode, result) => {

   //console.log(checkDataQr("1-96-1-1-1-96-1-1-2021-10-6"));
   

   if(checkDataQr(dataQrCode)==false){
       result(null,"error code");
       return ;
   }

    let myArr = dataQrCode.split('-');
    let id_enseignement = myArr[0];
    let time = myArr[8] + '-' + myArr[9] + '-' + myArr[10];

    sql.query(`UPDATE presence_etudiant SET id_etat_presence_etd='1' WHERE id_etudiant=${id_etudaint} and id_enseignement=${id_enseignement} and time='${time}'`, (err, res) => {
        if (err) {
            console.log(err.message);
            result(err, null);
            return;
        } else {

            result(null, "Success Action");
            return;

        }
    });

    return;
}


const checkGPS = (currentLocation, result) => {
    let myArr = currentLocation.split(',');
    let latitudeEtudiant = myArr[0];
    let longitudeEtudiant = myArr[1];
    sql.query(`SELECT value FROM parameter where ref = 'rades'`, (err, res) => {
        if (err) {
            console.log(err.message);
            result(err, null);
            return;
        } else {

            let locationIset = res[0].value.split(',');
            let latitudeIset = locationIset[0];
            let longitudeIset = locationIset[1];
            let distance = calculateDistance(latitudeEtudiant, longitudeEtudiant, latitudeIset, longitudeIset);
            
            if (distance['meters'] > 200) {
                result(null, "Error Location");
            } else {
                result(null, "Valid Location");
            }
            return;

        }
    });

}



function deg2rad(deg) {
    return (deg * Math.PI) / 180.0;
}

function rad2deg(rad) {
    return rad * 180 / Math.PI;
}

function calculateDistance($lat1, $long1, $lat2, $long2) {
    var result = [];
    theta = $long1 - $long2;
    miles = (Math.sin(deg2rad($lat1))) * Math.sin(deg2rad($lat2)) + (Math.cos(deg2rad($lat1)) * Math.cos(deg2rad($lat2)) * Math.cos(deg2rad(theta)));
    miles = Math.acos(miles);
    miles = rad2deg(miles);
    result['miles'] = miles * 60 * 1.1515;
    result['feet'] = result['miles'] * 5280;
    result['yards'] = result['feet'] / 3;
    result['kilometers'] = result['miles'] * 1.609344;
    result['meters'] = result['kilometers'] * 1000;
    return result;
}


module.exports = {
    getUser,
    getListMatiere,
    getListDetaillMatiere,
    getCountAbsence,
    scanneQrCode,
    checkGPS
}