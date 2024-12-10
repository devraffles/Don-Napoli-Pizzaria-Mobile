import { useState, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar 
} from 'react-native';

import { AuthContext } from '../../contexts/AuthContext';

export default function SignIn(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, loading } = useContext(AuthContext);

    async function handleLogin(){
        if(email === '' || password === ''){
            return;
        }

        await signIn({email, password})
    }

    return (
        <View style={style.container}>
            <StatusBar 
                backgroundColor='#1d1d2e' 
                barStyle="light-content" 
                translucent={false}
            />
            <Image
                style={style.logo}
                source={require("../../assets/logo-completa-white.png")}
            />

            <View style={style.inputContainer}>
                <TextInput
                    style={style.input}
                    placeholder='Digite o seu email..'
                    placeholderTextColor="#f0f0f0"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={style.input}
                    placeholder='Digite a sua senha..'
                    placeholderTextColor="#f0f0f0"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={style.btn} onPress={handleLogin}>
                    {
                        loading ? (
                            <ActivityIndicator size={25} color="#1d1d2e"/>
                        ) : (
                            <Text style={style.btnText}>
                                Acessar
                            </Text>
                        )
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d1d2e'
    },
    logo:{
        marginBottom: 18,
        width: '60%',
        height: '30%'
    },
    inputContainer:{
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 32,
        paddingHorizontal: 14
    },
    input:{
        width: '95%',
        height: 40,
        backgroundColor: '#101026',
        borderRadius: 8,
        paddingHorizontal: 8,
        color: '#f2f2f2',
    },
    btn:{
        width: '95%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '101026'
    },
})