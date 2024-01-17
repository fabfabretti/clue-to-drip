import testData from './data/data.js'


function convertFile() {
    const fileInput = document.getElementById('fileInput');
    const outputElement = document.getElementById('output');

    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Perform your file conversion logic here
            const convertedData = convertFunction(e.target.result);

            // Display the converted data
            outputElement.innerText = convertedData;
        };

        // Read the file as text
        reader.readAsText(file);
    } else {
        outputElement.innerText = 'Please choose a file';






    }
}

function convertFunction(dataString) {
    const headerRow = "date,temperature.value,temperature.exclude,temperature.time,temperature.note,bleeding.value,bleeding.exclude,mucus.feeling,mucus.texture,mucus.value,mucus.exclude,cervix.opening,cervix.firmness,cervix.position,cervix.exclude,note.value,desire.value,sex.solo,sex.partner,sex.condom,sex.pill,sex.iud,sex.patch,sex.ring,sex.implant,sex.diaphragm,sex.none,sex.other,sex.note,pain.cramps,pain.ovulationPain,pain.headache,pain.backache,pain.nausea,pain.tenderBreasts,pain.migraine,pain.other,pain.note,mood.happy,mood.sad,mood.stressed,mood.balanced,mood.fine,mood.anxious,mood.energetic,mood.fatigue,mood.angry,mood.other,mood.note"
    var data = JSON.parse(dataString)


    console.log(data.filter(entry => entry.date === "2024-01-13"))
    console.log(data)
}


async function fetchTestData(convertFunction){
    var filePath = "./data/measurements.json"
    var data = null
    try{
        const response = await fetch(filePath)
        console.log(response.ok)
        if(!response.ok){
            throw new Error('Porcodio');
        }
        else{
            data = await response.text();
            data = convertFunction(data)
        }

    }catch(error){
        console.error("Porcodio rilevato")
        throw error;
    }
}




fetchTestData(convertFunction)


