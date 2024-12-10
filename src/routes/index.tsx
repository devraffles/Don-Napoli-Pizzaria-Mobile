import { useContext } from "react";

import { View, ActivityIndicator } from 'react-native';

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

import { AuthContext } from "../contexts/AuthContext";

export default function Routes() {

    const {isAuthenticated, loading} = useContext(AuthContext)

    if(loading){
        return(
            <View 
                style={{
                    flex: 1,
                    backgroundColor: '#1d1d2e',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActivityIndicator
                    size={60}
                    color="#f2f2f2"
                />
            </View>
        );
    }

    return (
        isAuthenticated ? <AppRoutes/> : <AuthRoutes/>
    );
}