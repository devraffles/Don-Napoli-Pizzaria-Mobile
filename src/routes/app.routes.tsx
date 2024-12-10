import { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";

import { AuthContext } from '../contexts/AuthContext';
import FinishOrder from "../pages/FinishOrder";

export type StackPramsList = {
    Dashboard: undefined;
    Order: {
        number: number | string;
        order_id: string;
    };
    FinishOrder: {
        number: number | string;
        order_id: string;
    };
}

const Stack = createStackNavigator<StackPramsList>();

export default function AppRoutes(){

    const { singOut } = useContext(AuthContext);

    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Dashboard" 
                component={Dashboard}
                options={{
                    headerStyle: {
                        backgroundColor: '#101026',
                    },
                    headerTitleStyle: {display: 'none'},
                    headerRight: () => (
                        <TouchableOpacity onPress={singOut}>
                            <Ionicons
                                name='log-out-outline'
                                size={28}
                                color='#ff3f4b'
                                style={{
                                    marginRight: 12
                                }}
                            />
                        </TouchableOpacity>
                    ),
                    headerLeft: () => (
                        <Image
                        source={require("../../assets/icon.png")}
                            style={{
                                width: 40,
                                height: 40,
                                marginLeft: 12
                            }}
                        />
                    )
                }}
            />
            <Stack.Screen 
                name="Order" 
                component={Order}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="FinishOrder" 
                component={FinishOrder}
                options={{
                    title: 'Finalizando',
                    headerStyle: {
                        backgroundColor: '#101026',
                    },
                    headerTintColor: '#f2f2f2'
                }}
            />
        </Stack.Navigator>
    )
}