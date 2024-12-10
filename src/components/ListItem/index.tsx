import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import { Feather } from '@expo/vector-icons'

interface ItemProps {
    data:{
        id: string;
        product_id: string;
        name: string;
        amount: string | number;
    }
    deleteItem: (item_id: string) => void
}

export default function ListItem({ data, deleteItem }: ItemProps) {

    function handleDeleteItem(){
        deleteItem(data.id)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.item}>
                {data.amount} - {data.name}
            </Text>

            <TouchableOpacity onPress={handleDeleteItem}>
                <Feather
                    name='trash-2'
                    size={28}
                    color='#ff3f4b'
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#101026',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        borderWidth: 0.4,
        borderColor: '#8a8a8a'
    },
    item:{
        color: '#f2f2f2'
    }
})