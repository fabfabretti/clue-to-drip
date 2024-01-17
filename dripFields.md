```js
{
  "temperature.value": "", // : float with 4.2f precision
  "temperature.exclude": "", // : boolean
  "temperature.time": "",// : time value with hh:mm format
  "temperature.note": "",//freeform text
  "bleeding.value":"",//int in [0,3]
  "bleeding.exclude":"",//boolean
  "mucus.feeling": "",//int in [0,3]
  "mucus.texture": "",//int in [0,2]
  "mucus.value": "",//int in [0,4]

  /*· 0 = (dry feeling + no texture),
    · 1 = (no feeling + no texture),
    · 2 = (wet feeling + no texture),
    · 3 = (no OR wet feeling + creamy texture),
    · 4 = (any feeling + egg white texture) OR (slippery feeling + any texture).
    null if either mucus.feeling OR mucus.texture are not present.
  */
 
  "mucus.exclude": "",//boolean
  "cervix.opening": "",//int in [0,2]
  "cervix.firmness": "",//int in [0,1]
  "cervix.position": "",//int in [0,2]
  "cervix.exclude": "",//boolean
  "note.value": "", // freeform text
  "desire.value": "",// int in [0,2]
  "sex.solo": "",//boolean
  "sex.partner": "",//boolean
  "sex.condom": "",//boolean
  "sex.pill": "",//boolean
  "sex.iud": "",//boolean
  "sex.patch": "",//boolean
  "sex.ring": "",//boolean
  "sex.implant": "",//boolean
  "sex.diaphragm": "",//boolean
  "sex.none": "",//boolean ---
  "sex.other": "",//boolean
  "sex.note": "",//freeform text
  "pain.cramps": "",//boolean
  "pain.ovulationPain": "",//boolean
  "pain.headache": "",//boolean
  "pain.backache": "",//boolean
  "pain.nausea": "",//boolean
  "pain.tenderBreasts": "",//boolean
  "pain.migraine": "",//boolean
  "pain.other": "",//boolean
  "pain.note": "",//freeform text
  "mood.happy": "",//boolean-
  "mood.sad": "",//boolean-
  "mood.stressed": "",//boolean
  "mood.balanced": "",//boolean
  "mood.fine": "",//boolean
  "mood.anxious": "",//boolean-
  "mood.energetic": "",//boolean
  "mood.fatigue": "",//boolean
  "mood.angry": "",//boolean-
  "mood.other": "",//boolean
  "mood.note": "",//freeform text
}
```