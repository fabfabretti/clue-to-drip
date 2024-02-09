![clue to drip.](cover.png)

A simple tool that allows you to smoothly import all of your data from [Clue](https://helloclue.com/) into [drip.](https://bloodyhealth.gitlab.io/index.html). <br>Supports all types of bleeding data and most tags!
<br><br> While not finished yet, the core functionality is already available at [https://fabfabretti.github.io/clue-to-drip/](https://fabfabretti.github.io/clue-to-drip/). :)

## Current tag conversion rules
As not all tags available in Clue are also available in drip., the extra data is stored in the note.value or [category].note column.
In the table below I explain the conversion I used between the two system. 
* The icon 📄 means that the tag is (also) written in the generic note.value column.
* The icon 🔎 means that the tag is (also) written in the specific value column. For example, the pain category will have pain.other = true and pain.note with the value.

<br>

| Clue   |      drip.      |
|----------|-------------|
| period/light|   bleeding.value = 1, bleeding.exclude = false          |
| period/medium|   bleeding.value = 2, bleeding.exclude = false          |
| period/heavy|   bleeding.value = 3, bleeding.exclude = false          |
| period/very_heavy|   bleeding.value = 3, bleeding.exclude = false          |
| spotting|bleeding.value = 0, bleeding.exclude = true|
|pain/period_cramps|pain.cramps|
|pain/lower_back|pain.backache|
|pain/breast_tenderness|pain.tenderBreasts|
|pain/headache|pain.headache|
|pain/ovulation|pain.ovulationPain|
|pain/migraine|pain.migraine|
|pain/migraine_with_aura|pain.migraine + 🔎pain🔎|
|pain/pain_free| discarded|
|pain/*|🔎pain🔎|
|feelings/sad|mood.sad|
|feelings/happy|mood.happy|
|feelings/angry|mood.angry|
|feelings/anxious|mood.anxious|
|feelings/indifferent|mood.fine|
|feelings/*|🔎mood🔎|
|sex_life/no_sex_today|sex.none|
|sex_life/withdrawal|sex.none|
|sex_life/masturbation|sex.solo|
|sex_life/high_sex_drive|desire.value = 2|
|sex_life/low_sex_drive|desire.value = 0|
|energy/energetic|mood.energetic|
|energy/fully_energized|mood.energetic|
|energy/tired|mood.fatigue|
|energy/exhausted|mood.fatigue|
|pms|📄|
|digestion/nauseous|pain.nausea|
|digestion/*|🔎pain🔎|
|discharge/none|mucus.texture = 0|
|discharge/sticky|mucus.texture = 1|
|discharge/creamy|mucus.texture = 1|
|discharge/egg_white|mucus.texture = 2|
|bbt|temperature.exclude = false, temperature.value = value, temperature.time = 00:00|
|collection_method/*|📄|
|social_life/*|📄|
|craving/*|📄|
|mind/*|📄|
|exercise/*|📄|
|stool/*|📄|
|leisure/*|📄|
|hair/*|📄|
|skin/*|📄|
|medication/*|📄|
|appointments/*|📄|
|ailments/*|📄|


## Changelog
* 2024.01.09 Fixed missing conversion for "period/very_heavy" tag.
* 2024.01.30 Fixed Clue email, and changed conversion logic so that spotting is not counted as a period.


## Upcoming
> [!NOTE]  
> While the tool is functional, testing was very limited because of the difficulty in getting my hands on Clue data. If you want to help, I'd be more than happy to get some more data to test on!
* ~A decent UI is on its way, I promise~ ✅
* Excluded cycle data
* Checks on input file
* Birth-control related tags (currently, all tags except custon tags and these ones are already supported)


## Credits
Both Clue and drip. are owned by their respective owners. UI design is shamelessly inspired by drip.'s official site and [flo-to-drip](https://github.com/SaraVieira/flo-to-drip).
