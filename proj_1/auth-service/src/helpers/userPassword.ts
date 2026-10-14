import bcrypt from "bcrypt";

async function hashPassword(pwd: string) {
    const saltRounds = 10;
    const hashPwd = await bcrypt.hash(pwd, saltRounds);
    return hashPwd
}

async function comparePassword(plainTextPwd: string, hashPwd: string) {
    const isValid = await bcrypt.compare(plainTextPwd, hashPwd);
    return isValid ? true : false
}

export {
    hashPassword,
    comparePassword
}