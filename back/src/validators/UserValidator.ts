import IUser from "../interfaces/IUser";

type UserValidationErrors = Partial<Record<keyof IUser, string>>;

export default function UserValidator(user: Partial<IUser>): UserValidationErrors {
    const errors: UserValidationErrors = {};

    if (!user.userName || !isValidName(user.userName)) {
        errors.userName = "Nome inválido";
    }

    if (!user.email || !isValidEmail(user.email)) {
    errors.email = "Email inválido";
    }

    if (!user.password || !isValidPassword(user.password)) {
        errors.password = "Senha inválida";
    }
    
    if (user.gender && !isValidGender(user.gender)) {
    errors.gender = "Gênero inválido";
    }

    if (user.weight && !isValidWeight(user.weight)) {
    errors.weight = "Peso inválido";
    }

    if (user.height && !isValidHeight(user.height)) {
    errors.height = "Altura inválida";
    }

    if (user.occupation && !isValidOccupation(user.occupation)) {
    errors.occupation = "Ocupação inválida";
    }

    if (user.age && !isValidAge(user.age)) {
    errors.age = "Idade inválida";
    }

    return errors;
}

function isValidName(name: string): boolean {
    const NAME_REGEX = /^[a-zA-Zà-úÀ-Ú ]+$/;
    return NAME_REGEX.test(name);
}
    
function isValidEmail(email: string): boolean {
    const EMAIL_REGEX = /^(\w{1,}@\w{1,}\.(\w{3})(\.\w{2}){0,1})$/gim;
    return EMAIL_REGEX.test(email);
}

function isValidPassword(password: string): boolean {
    const PASSWORD_REGEX = /^\w{1,}$/gim;
    return PASSWORD_REGEX.test(password) && password.length >= 8;
}

function isValidGender(gender: string): boolean {
    const GENDER_REGEX = /^[MFO]$/;
    return GENDER_REGEX.test(gender);
}

function isValidWeight(weight: string): boolean {
    const WEIGHT_REGEX = /^\d{1,3}kg$/;
    return WEIGHT_REGEX.test(weight);
}

function isValidHeight(height: string): boolean {
    const HEIGHT_REGEX = /^\d{1,3}cm$/;
    return HEIGHT_REGEX.test(height);
}

function isValidOccupation(occupation: string): boolean {
    const OCCUPATION_REGEX = /^[a-zA-Z -]*$/;
    return OCCUPATION_REGEX.test(occupation);
}

function isValidAge(age: number): boolean {
    return typeof age === 'number' && age >= 0;
}