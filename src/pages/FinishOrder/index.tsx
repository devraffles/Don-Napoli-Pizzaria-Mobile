import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar
} from 'react-native';

import { Feather } from '@expo/vector-icons';

import {
    useNavigation,
    useRoute,
    RouteProp
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { StackPramsList } from '../../routes/app.routes';

import { api } from '../../services/api';

type RouteDetailParams = {
    FinishOrder: {
        number: number | string;
        order_id: string;
    };
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export default function FinishOrder(){

    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    async function handleFinish() {
        try {
            await api.put('order/send', {
                order_id: route.params.order_id
            });

            navigation.popToTop();
        } catch (error) {
            console.log("Erro: " + error);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar 
                backgroundColor='#101026' 
                barStyle="light-content" 
                translucent={false}
            />
            <Text style={styles.alert}>
                Você deseja finalizar esse pedido?
            </Text>
            <Text style={styles.table}>
                Mesa {route.params?.number}
            </Text>

            <TouchableOpacity style={styles.btn} onPress={handleFinish}>
                <Text style={styles.btnText}>
                    Finalizar Pedido
                </Text>
                <Feather
                    name='shopping-cart'
                    size={20}
                    color='#1d1d2e'
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingHorizontal: '5%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alert:{
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: 'bold',
        marginBottom: 12
    },
    table:{
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#f2f2f2'
    },
    btn:{
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: '55%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        gap: 14
    },
    btnText:{
        color: '#1d1d2e',
        fontSize: 18,
    },
});