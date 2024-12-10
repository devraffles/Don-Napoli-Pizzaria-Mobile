import { useState, createContext, ReactNode, useEffect } from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    singOut: () => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    setLoadingTrue: () => void;
    setLoadingFalse: () => void;
}

type UserProps = {
	id: string;
	name: string;
	email: string;
	token: string
}

type SignInProps = {
	email: string;
    password: string
}

type AuthProviderProps = {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps){

    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    });

    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user.token;

    useEffect(() => {
        async function getUser() {
            const userInfo = await AsyncStorage.getItem('@garcompizzaria');

            let hasUser: UserProps = JSON.parse(userInfo || '{}');

            if(Object.keys(hasUser).length > 0){
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;

                setUser({
                    id: hasUser.id,
                    email: hasUser.email,
                    name: hasUser.name,
                    token: hasUser.token
                })
            }

            setLoading(false)
        }

        getUser()
    }, [])

    async function signIn({ email, password }: SignInProps) {
        setLoadingAuth(true);

        try {  
            const response = await api.post('/session', {
                email, 
                password
            })

            const { 
                id,
                name,
                token
            } = response.data;

            const data = {
                ...response.data
            }

            await AsyncStorage.setItem('@garcompizzaria', JSON.stringify(data))

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                name,
                email,
                token
            });

            setLoadingAuth(false);
        } catch (error) {
            console.error('Erro ao Logar', error);
            setLoadingAuth(false);
        }
    }

    async function singOut() {
        await AsyncStorage.clear().then(() => {
            setUser({
                id: '',
                name: '',
                email: '',
                token: ''
            })
        })
    }

    function setLoadingTrue(){
        setLoading(true)
    }

    function setLoadingFalse(){
        setLoading(false)
    }

    return(
        <AuthContext.Provider 
            value={{ 
                user, 
                isAuthenticated, 
                signIn, 
                singOut,
                setLoadingTrue, 
                setLoadingFalse, 
                loadingAuth, 
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}