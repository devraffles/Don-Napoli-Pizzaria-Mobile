import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView
 } from 'react-native';

import { CategoryProps } from '../../pages/Order';

interface ModalPickerProps{
    handleCloseModal: () => void;
    options: CategoryProps[];
    selectedItem: (item: CategoryProps) => void;
}

const { width: Width, height: Height} = Dimensions.get('window');

export default function ModalPicker({handleCloseModal, options, selectedItem }: ModalPickerProps) {

    function onPressItem(item: CategoryProps){
        selectedItem(item)
        handleCloseModal();
    }

    const option = options.map((item, index) =>( 
        <TouchableOpacity key={index} style={styles.option} onPress={() => onPressItem(item)}>
            <Text style={styles.item}>
                {item.name}
            </Text>
        </TouchableOpacity>
    ));

    
    return (
        <TouchableOpacity onPress={handleCloseModal} style={styles.container}>
            <View style={[styles.content, {
                height: Height / 3.3
            }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content:{
        width: Width - 20,
        backgroundColor: '#1d1d2e',
        borderWidth: 1,
        borderColor: '#8a8a8a',
        borderRadius: 8
    },
    option:{
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: '#8a8a8a',
    },
    item:{
        padding: 18,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f2f2f2'
    },
})