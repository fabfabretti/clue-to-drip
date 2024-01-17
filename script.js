function convertFile() {
    const fileInput = document.getElementById('fileInput');
    const outputElement = document.getElementById('output');

    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Perform your file conversion logic here
            const convertedData = clueToObjects(e.target.result);

            // Display the converted data
            outputElement.innerText = convertedData;
        };

        // Read the file as text
        reader.readAsText(file);
    } else {
        outputElement.innerText = 'Please choose a file';






    }
}

function clueToObjects(dataString) {
    // drip. header columns and array of entries
    let dripEntries = []

    // parse Clue JSON
    var data = JSON.parse(dataString)

    // Get all unique dates, bc in drip. there's one entry per date so we'll need that later
    var entrydates = Array.from(new Set(data.map(entry => entry.date)))

    //Equivalence between Clue and drip. bleeding value
    var bleedingValues={"light":1,"medium":2,"heavy":3}


    //TBD
    getAllValues(data)

    //Now for each unique clue date we want to generate one drip entry.
    entrydates.forEach(date => 
        {
            // get the entries for current day only (is this wasteful af? yes. Do i care? no)
            var curr_entries = data.filter(entry => entry.date === date)


            // BELOW IS THE CORE OF THE PROGRAM. THIS IS THE CONVERSION
            // FROM CLUE TO OBJECT IN MEMORY.

            var dripEntry = {}

            curr_entries.forEach(entry =>
                    {
                        switch(entry.type){
                            case "period":
                                dripEntry.bleedingValue = bleedingValues[entry.value.option]
                                dripEntry.bleedingExclude = false 
                                break;   
                            case "spotting":
                                dripEntry.bleedingValue = 0
                                dripEntry.bleedingExclude = false
                                break;
                            case "pain": 
                                entry.value.forEach(item => {
                                    switch(item.option){
                                        case "period_cramps":
                                            dripEntry.painCramps = true
                                            break;
                                        case "lower_back":
                                            dripEntry.painBackache = true
                                            break;
                                        case "breast_tenderness":
                                            dripEntry.painTenderBreasts = true
                                            break;
                                        case "headache":
                                            dripEntry.painHeadache = true
                                            break;
                                        case "ovulation":
                                            dripEntry.painOvulationPain = true
                                            break;
                                        case "migraine":
                                        case "migraine_with_aura":
                                            dripEntry.painMigraine = true
                                            break;
                                        case "pain_free":
                                            break;                                
                                        default:
                                            dripEntry.painOther = true
                                            dripEntry.painNote ? dripEntry.painNote += (" " + item.option) : dripEntry.painNote = item.option

                                    }
                                })
                            break;
                            case "feelings": 
                                entry.value.forEach(item => {
                                    switch(item.option){
                                        default:
                                            dripEntry.moodOther = true
                                            dripEntry.moodNote ? dripEntry.moodNote += (" " + item.option) : dripEntry.moodNote = item.option
                                            break;
                                        case "sad":
                                            dripEntry.moodSad = true
                                            break
                                        case "happy":
                                            dripEntry.moodHappy = true
                                            break
                                        case "angry":
                                            dripEntry.moodAngry = true
                                            break
                                        case "anxious":
                                            dripEntry.moodAnxious = true
                                            break
                                    }
                                })
                            break;
                            case "sex_life":
                                entry.value.forEach(item => {
                                    switch(item.option){
                                        default:
                                            dripEntry.sexPartner = true
                                            dripEntry.sexOther = true
                                            dripEntry.sexNote ? dripEntry.sexNote += (" " + item.option) : dripEntry.sexNote = item.option
                                            break;
                                        case "no_sex_today":
                                        case "withdrawal":
                                            dripEntry.sexNone = true;
                                            break;
                                        case "masturbation":
                                            dripEntry.sexSolo = true;
                                            break;
                                    }
                                })
                            break;
                        }
                    }
                
                )

            // We only save the generated entry if it has at least 1 field supported by drip.
            if(!(Object.keys(dripEntry).length === 0)){
                dripEntry.date = date
                dripEntries.push(dripEntry)
            }
        });

        return dripEntries
}

function objectsToCSV(data){

    var csvContent = "date,temperature.value,temperature.exclude,temperature.time,temperature.note,bleeding.value,bleeding.exclude,mucus.feeling,mucus.texture,mucus.value,mucus.exclude,cervix.opening,cervix.firmness,cervix.position,cervix.exclude,note.value,desire.value,sex.solo,sex.partner,sex.condom,sex.pill,sex.iud,sex.patch,sex.ring,sex.implant,sex.diaphragm,sex.none,sex.other,sex.note,pain.cramps,pain.ovulationPain,pain.headache,pain.backache,pain.nausea,pain.tenderBreasts,pain.migraine,pain.other,pain.note,mood.happy,mood.sad,mood.stressed,mood.balanced,mood.fine,mood.anxious,mood.energetic,mood.fatigue,mood.angry,mood.other,mood.note"


    //insert a test with all the entry to check they're all correct
    const data_complex = 
        {
            date:"2024-01-16",
            temperatureValue: 35.75, // : float with 4.2f precision
            temperatureExclude: false, // : boolean
            temperatureTime: "10:10",// : time value with hh:mm format
            temperatureNote: "note",//freeform text
            bleedingValue:0,//int in [0,3]
            bleedingExclude:false,//boolean
            mucusFeeling: 0,//int in [0,3]
            mucusTexture: 0,//int in [0,2]
            mucusValue: 0,//int in [0,4]
            mucusExclude: false,//boolean
            cervixOpening: 0,//int in [0,2]
            cervixFirmness: 0,//int in [0,1]
            cervixPosition: 0,//int in [0,2]
            cervixExclude: false,//boolean
            noteValue: "note value", // freeform text
            desireValue: 0,// int in [0,2]
            sexSolo: false,//boolean
            sexPartner:true,//boolean
            sexCondom: false,//boolean
            sexPill: false,//boolean
            sexIud: false,//boolean
            sexPatch: false,//boolean
            sexRing: false,//boolean
            sexImplant: false,//boolean
            sexDiaphragm: false,//boolean
            sexNone: false,//boolean
            sexOther: false,//boolean
            sexNote: "sex note",//freeform text
            painCramps: false,//boolean
            painOvulationPain: false,//boolean
            painHeadache: false,//boolean
            painBackache: false,//boolean
            painNausea: false,//boolean
            painTenderBreasts: false,//boolean
            painMigraine: false,//boolean
            painOther: false,//boolean
            painNote: "pain note",//freeform text
            moodHappy: false,//boolean
            moodSad: false,//boolean
            moodStressed: false,//boolean
            moodBalanced: false,//boolean
            moodFine: false,//boolean
            moodAnxious: false,//boolean
            moodEnergetic: false,//boolean
            moodFatigue: false,//boolean
            moodAngry: false,//boolean
            moodOther: false,//boolean
            moodNote: "mood note",//freeform text
          }


    data.forEach(entry => {
        csvContent+=("\n")
        csvContent+=(entry.date)+","


        entry.temperatureValue !== undefined ? csvContent+=entry.temperatureValue+"," : csvContent+=","
        entry.temperatureExclude !== undefined ? csvContent+=entry.temperatureExclude+"," : csvContent+=","

        entry.temperatureTime !== undefined ? csvContent+=entry.temperatureTime+"," : csvContent+=","
        entry.temperatureNote !== undefined ? csvContent+=entry.temperatureNote+"," : csvContent+=","


        entry.bleedingValue !== undefined ? csvContent+=entry.bleedingValue+"," : csvContent+=","
        entry.bleedingExclude !== undefined ? csvContent+=entry.bleedingExclude+"," : csvContent+=","


        entry.mucusFeeling !== undefined ? csvContent+=entry.mucusFeeling+"," : csvContent+=","
        entry.mucusTexture !== undefined ? csvContent+=entry.mucusTexture+"," : csvContent+=","
        entry.mucusValue !== undefined ? csvContent+=entry.mucusValue+"," : csvContent+=","
        entry.mucusExclude !== undefined ? csvContent+=entry.mucusExclude+"," : csvContent+=","


        entry.cervixOpening !== undefined ? csvContent+=entry.cervixOpening+"," : csvContent+=","
        entry.cervixFirmness !== undefined ? csvContent+=entry.cervixFirmness+"," : csvContent+=","
        entry.cervixPosition !== undefined ? csvContent+=entry.cervixPosition+"," : csvContent+=","
        entry.cervixExclude !== undefined ? csvContent+=entry.cervixExclude+"," : csvContent+=","

        entry.noteValue !== undefined ? csvContent+=entry.noteValue+"," : csvContent+=","
        
        entry.desireValue !== undefined ? csvContent+=entry.desireValue+"," : csvContent+=","

        entry.sexSolo !== undefined ? csvContent+=entry.sexSolo+"," : csvContent+=","
        entry.sexPartner !== undefined ? csvContent+=entry.sexPartner+"," : csvContent+=","
        entry.sexCondom !== undefined ? csvContent+=entry.sexCondom+"," : csvContent+=","
        entry.sexPill !== undefined ? csvContent+=entry.sexPill+"," : csvContent+=","
        entry.sexIud !== undefined ? csvContent+=entry.sexIud+"," : csvContent+=","
        entry.sexPatch !== undefined ? csvContent+=entry.sexPatch+"," : csvContent+=","
        entry.sexRing !== undefined ? csvContent+=entry.sexRing+"," : csvContent+=","
        entry.sexImplant !== undefined ? csvContent+=entry.sexImplant+"," : csvContent+=","
        entry.sexDiaphgram !== undefined ? csvContent+=entry.sexDiaphgram+"," : csvContent+=","
        entry.sexNone !== undefined ? csvContent+=entry.sexNone+"," : csvContent+=","
        entry.sexOther !== undefined ? csvContent+=entry.sexOther+"," : csvContent+=","
        entry.sexNote !== undefined ? csvContent+=entry.sexNote+"," : csvContent+=","

        entry.painCramps !== undefined ? csvContent+=entry.painCramps+"," : csvContent+=","
        entry.painOvulationPain !== undefined ? csvContent+=entry.painOvulationPain+"," : csvContent+=","
        entry.painHeadache !== undefined ? csvContent+=entry.painHeadache+"," : csvContent+=","
        entry.painBackache !== undefined ? csvContent+=entry.painBackache+"," : csvContent+=","
        entry.painNausea !== undefined ? csvContent+=entry.painNausea+"," : csvContent+=","
        entry.painTenderBreasts !== undefined ? csvContent+=entry.painTenderBreasts+"," : csvContent+=","
        entry.painMigraine !== undefined ? csvContent+=entry.painMigraine+"," : csvContent+=","
        entry.painOther !== undefined ? csvContent+=entry.painOther+"," : csvContent+=","
        entry.painNote !== undefined ? csvContent+=entry.painNote+"," : csvContent+=","

        entry.moodHappy !== undefined ? csvContent+=entry.moodHappy+"," : csvContent+=","
        entry.moodSad !== undefined ? csvContent+=entry.moodSad+"," : csvContent+=","
        entry.moodStressed !== undefined ? csvContent+=entry.moodStressed+"," : csvContent+=","
        entry.moodBalanced !== undefined ? csvContent+=entry.moodBalanced+"," : csvContent+=","
        entry.moodFine !== undefined ? csvContent+=entry.moodFine+"," : csvContent+=","
        entry.moodAnxious !== undefined ? csvContent+=entry.moodAnxious+"," : csvContent+=","
        entry.moodEnergetic !== undefined ? csvContent+=entry.moodEnergetic+"," : csvContent+=","
        entry.moodFatigue !== undefined ? csvContent+=entry.moodFatigue+"," : csvContent+=","
        entry.moodAngry !== undefined ? csvContent+=entry.moodAngry+"," : csvContent+=","
        entry.moodOther !== undefined ? csvContent+=entry.moodOther+"," : csvContent+=","
        entry.moodNote !== undefined ? csvContent+=entry.moodNote+"," : csvContent+=","

        // remove last comma
        csvContent = csvContent.slice(0,-1)
    
    })

 


    const dataUri = "data:text/csv;charset=utf8,"+ encodeURIComponent(csvContent)

    const link = document.createElement("a")
    link.setAttribute("href",dataUri)
    link.setAttribute("download","tf.csv")
    document.body.appendChild(link)

    document.getElementById('downloadButton').addEventListener('click', () => {
        link.click();
    });

    document.getElementById("output").innerHTML=csvContent

}

async function fetchTestData(convertFunction,writeFunction){
    //location of test file
    var filePath = "./data/measurements_2.json"

    var data = null

    try{
        const response = await fetch(filePath)
        
        if(!response.ok){
            throw new Error('There were issues loading the test file...');
        }
        else{
            data = await response.text()
            data = convertFunction(data)
            console.log("Clue file loaded correctly.")
            data = writeFunction(data)
        }

    }catch(error){
        console.error("There were issues.")
        throw error;
    }
}

var data = await fetchTestData(clueToObjects,objectsToCSV)

function getAllValues(data){
    
    console.log("EVENT TYPES: " + Array.from(new Set(data.map(entry=>entry.type))))
    
    
    const pain_array = 
        Array.from(new Set(data
            .filter(entry=>entry.type === "pain")
            .flatMap(entry=>entry.value)
            .map(value=>value.option)
        ))
    console.log("PAIN: " + pain_array)

    
    const feelings_array = 
        Array.from(new Set(data
            .filter(entry=>entry.type === "feelings")
            .flatMap(entry=>entry.value)
            .map(value=>value.option)
        ))
    console.log("FEELINGS: " + feelings_array)

    
    const sex_life_array = 
        Array.from(new Set(data
            .filter(entry=>entry.type === "sex_life")
            .flatMap(entry=>entry.value)
            .map(value=>value.option)
        ))
    console.log("SEX: " + sex_life_array)
    
}
