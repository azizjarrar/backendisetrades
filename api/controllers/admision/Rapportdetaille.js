const fs = require("fs");
const PDFDocument = require("pdfkit");
var blobStream = require('blob-stream');
var moment = require('moment');
function createReport(student, path) {

  let doc = new PDFDocument({ size: "A4", margin: 50 });

  for (const objet of student) {
    generateHeader(doc, objet);
  generateStudentInformation(doc, objet);
  generateCursusgeneraleInfo(doc, objet)
  generateTable(doc, objet);
  doc.addPage();
  }
 /* generateFooter(doc,invoice);
  const stream = doc.pipe(blobStream());*/
  doc.end();




  doc.save();

  doc.pipe(fs.createWriteStream(path));


  return doc;
}

function generateHeader(doc,student) {
  doc
    .fillColor("#444444")
    .fontSize(16)
    .text('Score : '+ Number(student.score.toFixed(2)), 20, 40, { align: "left" })
     .text('Dossier : '+student.id_demande, 200, 40,{ align: "right" })
    .moveDown();
}

function generateStudentInformation(doc, student) {

  generateHr(doc, 185);

  const heightofInfo = 80;


  doc
    .fontSize(10)
    .text('CIN :', 50, heightofInfo)
    .font("Helvetica")
    .text(student.cin, 150, heightofInfo)
    .font("Helvetica")
    .text('Prénom :', 50, heightofInfo + 15)
    .text(student.prenom, 150, heightofInfo + 15)
    .text('Nom :', 50, heightofInfo + 30)
    .text(student.nom ,150,heightofInfo + 30)
    .text('Date de Naissance :', 50, heightofInfo +45)
    .font("Helvetica")
    .text(moment(student.date_naissance).format('YYYY-MM-DD'), 150, heightofInfo+45)
    .font("Helvetica")
    .text('Adresse mail :', 50, heightofInfo+60)
    .font("Helvetica")
    .text(student.email, 150, heightofInfo+60 );


    //other side
    doc.text('Année du bac :', 400, heightofInfo)
    .font("Helvetica")
    .text( student.annee, 480, heightofInfo)
    .font("Helvetica")
      .text('Section :', 400, heightofInfo + 15)
    .font("Helvetica")
    .text(student.section, 480, heightofInfo + 15)
    .text('Mention :',400,heightofInfo + 30 )
    .text(student.mention,480,heightofInfo + 30 )
    .text('Session :',400,heightofInfo + 45 )
    .text(student.session,480,heightofInfo + 45 )
    .text('Moyenne du bac :',400,heightofInfo + 60 )
    .text(student.moyenne,480,heightofInfo + 60 )
    doc.lineWidth(25);

    // line cap settings
    doc.lineCap('round')
       .moveTo(250, 210)
       .lineTo(350, 210)
       .stroke()
       .fillColor("#fff")
       .text('Cursus général',268,205)

    doc.moveDown();

  generateHr(doc, 70);
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}
function generateHr2(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(240, y)
    .stroke();
}
function generateCursusgeneraleInfo(doc,student)
{

  const heightofInfo = 245;
  generateHr(doc, 235);
  doc
    .fontSize(10)
    .fillColor('#444444')
    .text('Dernier diplôme obtenu:', 50, heightofInfo)
    .font("Helvetica")
    .text(student.diplome, 200, heightofInfo)
    .font("Helvetica")
    .text('Etablissement du diplôme:', 50, heightofInfo + 15)
    .text(student.libelleEtablissement, 200, heightofInfo + 15)
    .text("Année d'obtentation du diplome:", 50, heightofInfo + 30)
    .text(student.anneeobtentation ,200,heightofInfo + 30)
    .text('Domaine:', 50, heightofInfo +45)
    .font("Helvetica")
    .text('Informatique', 200, heightofInfo+45)
    .font("Helvetica")
    .text('Spécialité:', 50, heightofInfo+60)
    .font("Helvetica")
    .text('DSI', 200, heightofInfo+60 )
    .text('Nombre de redoublement:', 50, heightofInfo+75)
    .text(student.Redoublement, 200, heightofInfo+75 );
    generateHr(doc, 341);
    generateHr(doc, 379);
    doc.lineWidth(25);
    doc.lineCap('round')
    .moveTo(250, 360)
    .lineTo(350, 360)
    .stroke()
    .fillColor("#fff")
    .text('Cursus détaillé',268,355)
}
function generateTable(doc, student) {
  let i;
  const tableTop = 385;

  doc.font("Helvetica-Bold").fillColor("#444444");




  generateTableRow(
    doc,
    tableTop,
    'Année Univ',
    'Niveau',
    'Diplome',

    'Moyenne',
    'Crédit',
    'Session'
  )


  generateHr(doc, tableTop + 20);
  doc.font("Helvetica");
let position=0;
  for (i = 0; i < student.lstCursus.length; i++) {

     position = tableTop + (i + 1) * 30;

      generateTableRow(
        doc,
        position,
       student.lstCursus[i].au_debut+'/'+student.lstCursus[i].au_fin,
      student.lstCursus[i].nlibelle,
     student.diplome,
      student.lstCursus[i].moyenne,
      student.lstCursus[i].credit,
      student.lstCursus[i].session

      );




    generateHr(doc, position + 20);

  }
  generatesupplementaire(doc,student,position + 60);



}
function generateTableRow(
  doc,
  y,
  Anne,
  Niveau,
  Diplome,
  moyenne,
  credit,
   resultat ,



) {
  doc
    .fontSize(7)
    .text(Anne, 50, y)
    .text(Niveau, 180, y)
    .text(Diplome, 250, y)
    .text(moyenne, 380, y, { width: 60, align: "left" })
    .text(credit, 400, y, { width: 60, align: "right" })
    .text(resultat, 470, y, { width: 60, align: "right" })

}
function generatesupplementaire(doc,student,y)
{

  const heightofInfo = y+20;
  generateHr(doc, 235);
  doc
    .fontSize(10)
    .fillColor('#444444')
    .text('Note PFE :', 200, heightofInfo);
    for (const cursus of student.lstCursus) {
      if(cursus.nlibelle==='3')
      {
        doc.text(cursus.note_pfe, 370, heightofInfo);
      }
    }

    generateHr(doc, y);
    //generateHr(doc, 379);
    doc.lineWidth(25);
  doc.lineCap('round')
    .moveTo(250, y-20)
    .lineTo(368, y-20)
    .stroke()
    .fillColor("#fff")
    .text('Informations supplémentaires',245,y-25)
}

module.exports = {
  createReport
};
