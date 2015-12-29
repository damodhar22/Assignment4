var fs = require('fs');
var rl = require('readline');
var csvFileList=["India2011.csv","IndiaSC2011.csv","IndiaST2011.csv"];

function LiteracyRatio(category,population)
{
  this.category=category;
  this.population=population;
}

function AllStateLiteracyComparision(state,literate,illiterate)
{
  this.state=state;
  this.literate=literate;
  this.illiterate=illiterate;
}

var allStateLiteracyRatio=[];
var neStateLiteracyRatio=[];
var allStateLiteracyComparision=[];

var endofFile=0;
var literateMale=0;
var literateFemale=0;
var illiterateMale=0;
var illiterateFemale=0;

var literateMaleNE=0;
var literateFemaleNE=0;
var illiterateMaleNE=0;
var illiterateFemaleNE=0;

for(var i=0;i<csvFileList.length;i++ )
{
  var lineReader = rl.createInterface({
    input: fs.createReadStream('../data/'+csvFileList[i])
  });

  lineReader.on('line', function (line)
  {
    //console.log('Line from file:', line);
    var row = line.match(/(?:"(?:\\.|[^"])*"|\\.|[^,])+/g);

    //console.log(row[0]);
    processTheRow(row);
  });

  lineReader.on('close', function (line)
  {
    endofFile++;
    if(endofFile==csvFileList.length)
    {
      createAllStateLiteracyRatio();
      createNEStateLiteracyRatio();
      createAllStateLiteracyComparision();
    }

  });

}

function processTheRow(row)
{
  if(row[5].trim()=="All ages" && row[4].trim()=="Total")
  {
    literateMale+=parseInt(row[13]);
    literateFemale+=parseInt(row[14]);
    illiterateMale+=parseInt(row[10]);
    illiterateFemale+=parseInt(row[11]);
    console.log(row[1].trim()+"----");
    if(row[1].trim()=="12"||row[1].trim()=="13"||row[1].trim()=="14"||row[1].trim()=="15"||row[1].trim()=="16"||row[1].trim()=="17"||row[1].trim()=="18")
    {
      literateMaleNE+=parseInt(row[13]);
      literateFemaleNE+=parseInt(row[14]);
      illiterateMaleNE+=parseInt(row[10]);
      illiterateFemaleNE+=parseInt(row[11]);
    }
    //if(allStateLiteracyComparision.length>0)

    var flag=true;
    for(var i=0;i<allStateLiteracyComparision.length;i++)
    {
      if(allStateLiteracyComparision[i].state==row[3].trim())
      {
        allStateLiteracyComparision[i].literate+=parseInt(row[12]);
        allStateLiteracyComparision[i].illiterate+=parseInt(row[9]);
        flag=false;
        break;
      }
    }
    if(flag)
    {
      allStateLiteracyComparision.push(new AllStateLiteracyComparision(row[3].trim().substring(8),parseInt(row[12]),parseInt(row[9])));
    }

  }
}

function createAllStateLiteracyRatio()
{
  allStateLiteracyRatio.push(new LiteracyRatio("Literate Male",literateMale));
  allStateLiteracyRatio.push(new LiteracyRatio("Literate Female",literateFemale));
  allStateLiteracyRatio.push(new LiteracyRatio("Illiterate Male",illiterateMale));
  allStateLiteracyRatio.push(new LiteracyRatio("Illiterate Female",illiterateFemale));
  var allStateLiteracyRatioJson = JSON.stringify(allStateLiteracyRatio, null, 4);
  fs.writeFile( "../data/allStateLiteracyRatio.json", allStateLiteracyRatioJson, function(err) {
    if(err) {
      return console.log(err+" :error writing to JSON file");
    }
  });
}

function createNEStateLiteracyRatio()
{
  neStateLiteracyRatio.push(new LiteracyRatio("Literate Male",literateMaleNE));
  neStateLiteracyRatio.push(new LiteracyRatio("Literate Female",literateFemaleNE));
  neStateLiteracyRatio.push(new LiteracyRatio("Illiterate Male",illiterateMaleNE));
  neStateLiteracyRatio.push(new LiteracyRatio("Illiterate Female",illiterateFemaleNE));
  var neStateLiteracyRatioJson = JSON.stringify(neStateLiteracyRatio, null, 4);
  fs.writeFile( "../data/neStateLiteracyRatio.json", neStateLiteracyRatioJson, function(err) {
    if(err) {
      return console.log(err+" :error writing to JSON file");
    }
  });
}

function createAllStateLiteracyComparision()
{
  var allStateLiteracyComparisionJson = JSON.stringify(allStateLiteracyComparision, null, 4);
  fs.writeFile( "../data/allStateLiteracyComparision.json", allStateLiteracyComparisionJson, function(err) {
    if(err) {
      return console.log(err+" :error writing to JSON file");
    }
  });
}
