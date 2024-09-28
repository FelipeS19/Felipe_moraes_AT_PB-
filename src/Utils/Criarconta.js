// src/utils/criarconta.js

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();

export const register = async (name, email, password, dataNascimento, matricula) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            dataNascimento, 
            matricula, 
            isBlocked: false,
            role: 'user'
        });

        return { success: true, message: 'Conta criada com sucesso', user };
    } catch (error) {
        let errorMessage = 'Não foi possível criar a conta';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email em uso';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'email inválido';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Senha fraca';
        }
        throw new Error(errorMessage);
    }
};
