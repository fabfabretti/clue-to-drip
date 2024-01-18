/**
 * Converts Clue's JSON structure to a list of objects.
 *
 * @param   dataString a stringified JSON file in Clue's format.
 * @returns a list of objects with all the Clue data in a format closer to the one drip. uses.
 */
function clueToObjects(dataString) {
    // drip. header columns and array of entries
    let dripEntries = []

    // parse Clue JSON
    var data = JSON.parse(dataString)

    // Get all unique dates, bc in drip. there's one entry per date so we'll need that later
    var entrydates = Array.from(new Set(data.map(entry => entry.date)))

    //Equivalence between Clue and drip. bleeding value
    var bleedingValues={"light":1,"medium":2,"heavy":3}


    //Now for each unique clue date we want to generate one drip entry.
    entrydates.forEach(date => 
        {
            // get the entries for current day only (is this wasteful af? yes. Do i care? no)
            var curr_entries = data.filter(entry => entry.date === date)


            // BELOW IS THE hellish core OF THE PROGRAM. THIS IS THE CONVERSION
            // FROM CLUE TO OBJECT IN MEMORY. Objects in memory reflect drip.'s CSV structure, 
            // using the date as primary key, as opposed to Clue's dynamic structure and use of hashes as primary key.

            var dripEntry = {} // This is our "line". If this was typescript I'd have defined a good ol' type for it but nah

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
                                        case "indifferent":
                                            dripEntry.moodFine = true;
                                            break;
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
                                        case "high_sex_drive":
                                            dripEntry.desireValue = 2;
                                            break;
                                        case "low_sex_drive":
                                            dripEntry.desireValue = 0;
                                            break;
                                    }
                                })
                            break;
                            case "energy":
                                entry.value.forEach(item => {
                                    switch(item.option){
                                        default:
                                            break;
                                        case "energetic":
                                        case "fully_energized":
                                            dripEntry.moodEnergetic = true;
                                            break;
                                        case "exhausted":
                                        case "tired":
                                            dripEntry.moodFatigue = true;
                                            break; // As there is no correspondent for energy, I'll only translate this one which is more explicit
                                    }
                                })
                            break;
                            case "pms":
                                dripEntry.noteValue ? dripEntrynoteValue += (" pms") : dripEntry.noteValue = "pms"
                                break;
                            case "digestion":
                                entry.value.forEach(item => {
                                    switch(item.option){
                                        default:
                                            dripEntry.painOther = true;
                                            dripEntry.painNote ? dripEntry.painNote += ("["+entry.type+": " + item.option+"]") : dripEntry.painNote = ("["+entry.type+": " + item.option+"]")       
                                            break;
                                        case "nauseous":
                                            dripEntry.painNausea = true
                                            break
                                    }
                                })
                                break;
                            case "discharge":
                                entry.value.forEach(item => {
                                    //TODO: EXCLUSION CRITERION
                                    dripEntry.mucusExclude = false
                                    switch(item.option){
                                        case "none": //none,sticky,creamy,egg_white,atypical
                                            dripEntry.mucusTexture = 0
                                            break;
                                        case "sticky":
                                        case "creamy":
                                            dripEntry.mucusTexture = 1
                                            break
                                        case "egg_white":
                                            dripEntry.mucusTexture = 2

                                    }
                                })
                                break;
                            case "bbt":
                                dripEntry.temperatureExclude=entry.value.excluded
                                dripEntry.temperatureValue=entry.value.celsius
                                dripEntry.temperatureTime = "00:00"
                                break;
                            // tags not yet supported by drip: saves into freetext notes.
                            // leaving explicit names rather than "default" to make future edits easier
                            // leaving out all birth control tags for my own sanity (+ drip. doesn't support)
                            case "collection_method":
                            case "social_life":
                            case "craving":
                            case "mind":
                            case "exercise":
                            case "stool":
                            case "leisure":
                            case "hair":
                            case "skin":
                            case "medication":
                            case "appointments":
                            case "ailments":
                                entry.value.forEach(item => {
                                    dripEntry.noteValue ? dripEntry.noteValue += ("["+entry.type+": " + item.option+"]") : dripEntry.noteValue = ("["+entry.type+": " + item.option+"]")        
                                })
                                break;

                            //this is for my own tags. Anyone is more than welcome to generalize it!
                            case "tags":
                                entry.value.forEach(item => {
                                    switch(item.option){
                                        default:
                                            dripEntry.noteValue ? dripEntry.noteValue += ("["+entry.type+": " + item.option+"]") : dripEntry.noteValue = ("["+entry.type+": " + item.option+"]")        
                                            break;
                                        case "high libido":
                                        case "!":
                                            dripEntry.desireValue = 2;
                                            break;
                                        case "back cracking":
                                        case "BACK PAIN":
                                            dripEntry.painBackache = true;
                                            break;
                                        case "vulva pain?!":
                                        case "bedridden":
                                        case "flu":
                                        case "pee":
                                            dripEntry.painOther = true;
                                            dripEntry.painNote = item.option;
                                            break;
                                        case "sleeeep":
                                            dripEntry.moodFatigue = true;
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

/**
 * Takes the entries as an array of objects, and returns a string with everything put down in the correct order and CSV format.
 *
 * @param   data an array of objects as per created by the clueToObjects function.
 * @returns a string with the resulting CSV content, ready to be written on file.
 */
function objectsToCSV(data){

    var csvContent = "date,temperature.value,temperature.exclude,temperature.time,temperature.note,bleeding.value,bleeding.exclude,mucus.feeling,mucus.texture,mucus.value,mucus.exclude,cervix.opening,cervix.firmness,cervix.position,cervix.exclude,note.value,desire.value,sex.solo,sex.partner,sex.condom,sex.pill,sex.iud,sex.patch,sex.ring,sex.implant,sex.diaphragm,sex.none,sex.other,sex.note,pain.cramps,pain.ovulationPain,pain.headache,pain.backache,pain.nausea,pain.tenderBreasts,pain.migraine,pain.other,pain.note,mood.happy,mood.sad,mood.stressed,mood.balanced,mood.fine,mood.anxious,mood.energetic,mood.fatigue,mood.angry,mood.other,mood.note"
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

    return csvContent

}

/**
 * TEST STUFF
 * Takes the entries as an array of objects, and returns a string with everything put down in the correct order and CSV format.
 *
 * @param   convertFunction is the callback function to be called in order to load the Clue JSON as an array of objects in drip.'s format.
 * @param   writeFunction is the callback function to be called in order to generate the CSV file from the list of objects 
 * @returns a string with the resulting CSV content, ready to be written on file.
 */
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
            return data
        }

    }catch(error){
        console.error("There were issues.")
        throw error;
    }
}

/**
 * Takes a string with everything done and formatted.. and creates a downloadable .csv file out of it.
 * @param {*} csvContent 
 */
function createCSV(csvContent){
    
    const dataUri = "data:text/csv;charset=utf8,"+ encodeURIComponent(csvContent)

    const link = document.createElement("a")
    link.setAttribute("href",dataUri)
    link.setAttribute("download","tf.csv")
    document.body.appendChild(link)
    
    document.getElementById('downloadButton').addEventListener('click', () => {
        link.click();
    });
}

/**
 * TEST STUFF
 *  Takes the object list and prints sets with every event and, for each event, every tag of said event.
 * @param {*} data is the array of object as per clueToObject function.
 */
function getAllValues(data){
    
    var types = Array.from(new Set(data.map(entry=>entry.type)))
    console.log(types)

    types.forEach(type => {
        console.log(type.toUpperCase() +":\n" + Array.from(new Set(data
            .filter(entry=>entry.type === type)
            .flatMap(entry=>entry.value)
            .map(value=>value.option)
        )) )
    })
    
    
}

var csvContent = "Waiting for file..."

const fileInput = document.getElementById('fileInput');

// Read file from computer
const reader = new FileReader();
reader.onload = function(e) {
    console.log("a file was loaded");
    let rawfile = reader.result
    let objects = clueToObjects(rawfile)
    console.log("file was converted to object")
    csvContent = objectsToCSV(objects)
    document.getElementById("output").innerHTML=csvContent
}

fileInput.onchange = () => {
  const selectedFile = fileInput.files[0];
  reader.readAsText(selectedFile)
}


//SHOW RESULT
