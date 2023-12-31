export default interface IUser {
    name: string,
    userName: string,
    password?: string,
    email: string,
    created_at?: Date,
    updated_at?: Date,
    friends: string[],
    photo?: string,
    gender: string,
    weight: string,
    height: string,
    occupation: string,
    age: number,
    _id?: string,
}