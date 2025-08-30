export function getMaxCommonChar(text) {
    let maxCount = 0, maxChar = "";
    for (const char of text) {
        if (text.split(char).length - 1 > maxCount && !"\u200b \u200c".includes(char)) {
            maxCount = text.split(char).length - 1;
            maxChar = char
        }
    }
    return maxChar;
}

class AbstractCosmeticClass {
    constructor(data) {
        this.data = data;
    }

    extractData() {
        throw new Error("This method for child classes");
        return "";
    }

    convertToCosmetic() {
        throw new Error("This method for child classes");
        return "";
    }
}

export class SubstitutionCosmetic extends AbstractCosmeticClass {
    substitution = 0x1430;
    insertSpaces = false;


    replaceMiddleChars(str, target, replacement) {
        const regex = new RegExp(`(?<=.)${target}(?=.)`, 'g');
        return str.replace(regex, replacement);
    }

    restoreSpaces(str) {
        return str.replace(/ /g, this.maxChar)
    }

    convertToCosmetic() {
        let newMessageText = "";
        for (const byte of this.data) {
            const emojiCode = this.substitution + byte;
            newMessageText += String.fromCodePoint(emojiCode);
        }

        if (this.insertSpaces && newMessageText.length > 10) {
            const maxChar = getMaxCommonChar(newMessageText);
            this.maxCharUsed = maxChar;
            newMessageText = this.replaceMiddleChars(newMessageText, maxChar, " ");
        } else {
            this.maxCharUsed = getMaxCommonChar(newMessageText);
        }

        return newMessageText + this.maxCharUsed;
    }

    extractData(cosmeticText) {
        this.maxChar = cosmeticText.at(-1);
        cosmeticText = cosmeticText.slice(0, -1);

        const textWithoutSpaces = this.restoreSpaces(cosmeticText);
        const bytes = new Uint8Array(textWithoutSpaces.length);

        for (let i = 0; i < textWithoutSpaces.length; i++) {
            const charCode = textWithoutSpaces.codePointAt(i);
            const byte = charCode - this.substitution;
            if (byte < 0 || byte > 255) throw new Error(`Invalid character code: ${charCode}`);
            bytes[i] = byte;
        }
        return bytes.buffer;
    }
}

export class SmileCosmetic extends SubstitutionCosmetic {
    substitution = 0x1430;
    insertSpaces = true;
}

// 0450 смесь славянщины ԦҭѶӗҽՁԣѤԚѫѬԜҲҭӒ ӚӐѡҺӪѾћӲіҢԐӧўӁѻԊӧՌҽԃҥҫ԰ҵӹӡՊԟѺԕӖ҅қӣѹԔՂՄѵ҄ӄӦӲҶӕӑқԻѕ ԛҩԜӼӀӹԶӶԑԽԢӉӽӕӞҊԩѴ ҄ѦՁѳҖҩҔҖғ

// A500 что то типо стрелок ꖱꗸꔅ ꕝꖰꕖꕩꗲꕈꔫꔵꗀꔣꔟꗀꗁꕢꖥꗏꗻꔪꕄꖷꗟꕻꖧꕁꗱꔾꔜꖈꕇꕩ ꖮꗫꗾꗩꔠꕒꖷꗷꕨꔼꕰꔋꖬꔝꔥꖼꕙꖹꔛꔴꖦꗍꔺꖋꕋꖛꔡꗿꗜꗔꗈꔸꔌꗥꔾꗓꖣꕶꔠꖀꔭꗩꗢꖸ

// 1430 емоджи🏸🌧🎠🎑🎫 🌭🏿🎤🌗🌌🌌🏼🎁🎌🌐🏩🌵🏇🌺 🌇🎻🍗🌛🌰🍝🌱🍏🎌🏝🎝🍟🌣🎇🏂🏢🏍🌦🏲🍚🎐🍃🎷🍬🍚🌄🍌🍝🌰🎶🏟🌈🍗🏽🏡🎦🍳🍒🍫🎼🏔🍼🎦🏂🌠🎶🌊🎢🍥🏵🏱🌰🌍🏣🌋🏖🏢🏉🍽🎨🏸

// 2200 математические шмегули ∄⋠⊆≛⋔≯⋑∷⊽⊁⋀ ∩⊶⋒⋜≛∜∞∑ ≳⋀⊒⊿∑∀≬⋩⋷⊓∆⋚∂⊹≣⋆⋛⊍∔ ⋮⊮≞≫≶⊓⋖⋜≶≅⋣≍⋤∧⊙⊓≝∞∶⊝≿≝⊳⋇⋌⋍≠∜∙⊶≔⋋≳≑∱⊺⊩⊊∸⋪⊟⊫⋦⊚⋭∲⋳⊃⋞≵

// 1F000 карточки 🃪🁖🃺🁞🁡🂎🁊🂂🃔🀞🀎🃭🃻🂀🀞🂌🁆🀇🃫🂗🁌🁪🂖🁌🀹🃨 🁠🀟🂿🀨🁓🃐🂨🀓🂧🂳🁙🁖🀼 🂉🀅🂒🁉🂲🀓🁜🀺🂟🂙🂋🀥🂇 🁒🃈🂬🂏🀇🂱🀹🁞🃃🃲🂐🂞🃺🀛🁧🂫🀃🀏🁜🃢🃫🁋🃚🀩🃅🁐🁏🃏🁄🁦🀯🂬🁩🃳🁲🀵🁣🀌🂂🀫🂈🃍🁇🃋🂝🁰🁟🃤🂻🁩🂮🃶🁋🂒🁽🀠

// 1430 типо стрелочки ᓇᒜᓽᒑᒫᔓᒦᑠᒫᑳᓏᓮᒠᑿᑏᒎᑙᔄᑎᓾᒲᐷᑅ ᔧ ᑲᒏᐶᒏᓣᑉᒧᐳᑉᑎᔞᓠᒸᑁᐲᓰᑂᒈᐲᓂᒯᒩᔔᔥᐳᓛᑩᑇᑣᒇᓉᓞᑯᑻᒂᓯᑃᑉᑠᔝᔉᒝᔧ ᓁᐹᒈᑼᑭᐹᓚᔊᒙᔒᑝᒛᔪᒻ ᑅᒄᒟᔨᑮᒰᒽᑩᒅᒻᔃᒢᑂᒥᒨ