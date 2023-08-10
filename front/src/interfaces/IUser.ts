export interface User {
    id: string;
    userName: string;
    password: string;
    email: string;
    friends: Friend[];
    photo?: string;
    gender: string;
    weight: string;
    height: string;
    occupation: string;
    age: number;
    created_at: string;
    updated_at: string;
    __v: number;
  }
  
 export interface Friend {
    _id: string;
    userName: string;
    password: string;
    email: string;
    friends: Friend[]; // Array de IDs dos amigos (pode ser string[] ou Friend[])
    gender: string;
    weight: string;
    height: string;
    occupation: string;
    age: number;
    created_at: string;
    updated_at: string;
    __v: number;
  }

  export interface UserData {
    _id: string;
    userName: string;
    password: string;
    email: string;
    friends: Friend[];
    photo?: string;
    gender: string;
    weight: string;
    height: string;
    occupation: string;
    age: number;
    created_at: string;
    updated_at: string;
    __v: number;
  }