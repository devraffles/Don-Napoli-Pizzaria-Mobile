import { useState } from 'react';
import { 
    Text, 
    TouchableOpacity, 
    TextInput, 
    SafeAreaView, 
    StyleSheet,
    ActivityIndicator,
    StatusBar
 } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackPramsList } from '../../routes/app.routes';

import { api } from '../../services/api';

export default function Dashboard(){

    const [table, setTable] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    async function openOrder() {
        if(table === ''){
            return;
        }

        try {

            setLoading(true)

            const reponse = await api.post('/order', {
                table: Number(table)
            });

            navigation.navigate('Order', {
                number: table,
                order_id: reponse.data.id
            });
            
            setLoading(false)

            setTable('');
        } catch (error) {
            console.log("Erro: " + error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar 
                backgroundColor='#101026' 
                barStyle="light-content" 
                translucent={false}
            />
            <Text
                style={styles.title}
            >
                Novo Pedido
            </Text>

            <TextInput
                placeholder='Numero da Mesa'
                placeholderTextColor="#f0f0f0"
                keyboardType='numeric'
                style={styles.input}
                value={table}
                onChangeText={setTable}
            />

            <TouchableOpacity
                style={styles.btn}
                onPress={openOrder}
            >
                {loading === false ? (
                    <Text
                    style={styles.btnText}
                    >
                        Abrir Mesa
                    </Text>
                ) : (
                    <Text
                    style={styles.btnText}
                    >
                        <ActivityIndicator size={25} color="#101026"/>
                    </Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#1d1d2e',
        gap: 24
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#f2f2f2'
    },
    input:{
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 8,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 22,
        color: '#f2f2f2'
    },
    btn:{
        width: '90%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText:{
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    },
});