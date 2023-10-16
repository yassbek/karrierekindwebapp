const userTypes = {
    'f832d35f-2593-4f5b-be26-b847d0235cd2': 'Unternehmen',
    'eedf077c-77f0-4f20-a5c5-6636063d5563': 'Talente'
}
export const getUserTypeById = (id) => {
    return userTypes[id];
}
export const getIdByUserType = (userType) => {
    for (let key in userTypes) {
        if (userTypes[key] === userType) {
            return key;
        }
    }
    return null;
}
export const getFilledFields = (obj) => {
    let filledFields = {};

    for (let key in obj) {
        if (obj[key] !== '' && obj[key] !== null) {
            filledFields[key] = obj[key];
        }
    }

    return filledFields;
}

export const getImageFromDirectus = (imageId, extension) => {
    //if (!imageId) return undefined
    const config = useRuntimeConfig()
    const imageUrl = config.public.directusUrl + '/assets/' + imageId
    // TODO: replace with default image
    if (!imageUrl || !imageId ) return '/placeholder.png'
    return imageUrl
}

export const delay = (n) => {
    n = n || 2000
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, n)
    })
}

export const removeUnusedFields = (obj) => {
    for (let key in obj) {
        if (obj[key] === null) {
            delete obj[key];
        } else if (Array.isArray(obj[key])) {
            obj[key] = obj[key].filter(item => item !== null);
            obj[key].forEach(item => removeUnusedFields(item));
            if (obj[key].length === 0) {
                delete obj[key];
            }
        } else if (typeof obj[key] === 'object') {
            removeUnusedFields(obj[key]);
            if (Object.keys(obj[key]).length === 0) {
                delete obj[key];
            }
        }
    }
    return obj;
}


export const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

    if (regex.test(password)) {
        return true;
    } else {
        if (password.length < 8) {
            return "Das Passwort muss mindestens 8 Zeichen lang sein.";
        }
        if (!/[a-z]/.test(password)) {
            return "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Das Passwort muss mindestens einen Großbuchstaben enthalten.";
        }
        if (!/\d/.test(password)) {
            return "Das Passwort muss mindestens eine Zahl enthalten.";
        }
        if (!/[^\da-zA-Z]/.test(password)) {
            return "Das Passwort muss mindestens ein Sonderzeichen enthalten.";
        }
    }
}
