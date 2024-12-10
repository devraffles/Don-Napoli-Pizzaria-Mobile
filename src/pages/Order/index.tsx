import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ActivityIndicator,
    Modal,
    FlatList
} from 'react-native';

import { useState, useEffect, useContext } from 'react';

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons'
import { api } from '../../services/api';
import ModalPicker from '../../components/ModalPicker';
import ListItem from '../../components/ListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { StackPramsList } from '../../routes/app.routes';

import { AuthContext } from '../../contexts/AuthContext';

type RouteDetailParams = {
    Order: {
        number: number | string;
        order_id: string
    }
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>

export type CategoryProps = {
    id: string;
    name: string;
}

type ProductProps = {
    id: string;
    name: string;
}

type ItensProps = {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

export default function Order() {

    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    const route = useRoute<OrderRouteProps>();

    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
    const [modalCategory, setModalCategory] = useState(false);

    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
    const [modalProduct, setModalProduct] = useState(false);

    const [amount, setAmount] = useState('1');

    const [itens, setItens] = useState<ItensProps[]>([])


    const { loading, setLoadingTrue, setLoadingFalse } = useContext(AuthContext);

    async function handleCloseOrder() {
        try {

            setLoadingTrue();

            await api.delete('/order/delete', {
                params: {
                    order_id: route.params?.order_id
                }
            })

            setLoadingFalse()

            navigation.goBack();
        } catch (error) {
            console.log("Erro: " + error);
        }
    }

    useEffect(() => {
        async function loadInfoCategory() {
            try {
                const response = await api.get('/category/list')

                setCategory(response.data)
                setCategorySelected(response.data[0])
            } catch (error) {
                console.log("Erro: " + error);
            }
        }

        loadInfoCategory();
    }, [])

    useEffect(() => {

        async function loadProducts(){
            try {
                const response = await api.get('/category/product', {
                    params:{
                        category_id: categorySelected?.id
                    }
                })

                setProducts(response.data);
                setProductSelected(response.data[0])
            } catch (error) {
                console.log("Erro: " + error);
            }
        }
    
        loadProducts();
    
    }, [categorySelected])

    function handleChangeCategory(item: CategoryProps){
        setCategorySelected(item)
    }

    function handleChangeProduct(item: CategoryProps){
        setProductSelected(item)
    }

    async function handleAdd() {
        try {
            const response = await api.post('/order/add', {
                order_id: route.params.order_id,
                product_id: productSelected?.id,
                amount: Number(amount)
            })

            let data = {
                id: response.data.id,
                product_id: productSelected?.id as string,
                name: productSelected?.name as string,
                amount: amount
            }

            setItens(oldArray => [...oldArray, data])
        } catch (error) {
            console.log("Erro: " + error);
        }
    }

    async function handleDeleteItem(item_id: string) {
        try {
            await api.delete('/order/remove', {
                params:{
                    item_id: item_id
                }
            })
        
            let removeItem = itens.filter( item => {
                return (item.id !== item_id)
            })
        
            setItens(removeItem)
        } catch (error) {
            console.log("Erro: " + error);
        }
    }

    function handleFinishOrder() {
        navigation.navigate("FinishOrder", {
            number: route.params?.number,
            order_id: route.params?.order_id
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar 
                backgroundColor='#1d1d2e' 
                barStyle="light-content" 
                translucent={false}
            />
            <View style={styles.header}>
                <Text style={styles.title}>
                    Mesa {route.params.number}
                </Text>

                {itens.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        {
                            loading ? (
                                <ActivityIndicator size={25} color="#1d1d2e"/>
                            ) : (
                                <Feather
                                    name='trash-2'
                                    size={28}
                                    color='#ff3f4b'
                                />
                            )
                        }
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.inputContainer}>

                {category.length !== 0 ? (
                    <TouchableOpacity style={styles.input} onPress={() => setModalCategory(true)}>
                        <Text style={{
                            color: '#f2f2f2',
                            fontSize: 16
                        }}>
                            {categorySelected?.name}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.input}>
                        <ActivityIndicator size={25} color="#f2f2f2"/>
                    </TouchableOpacity>
                )}

                {products.length !== 0 ? (
                    <TouchableOpacity style={styles.input} onPress={ () => setModalProduct(true)} >
                        <Text style={{
                            color: '#f2f2f2',
                            fontSize: 16
                        }}>
                            {productSelected?.name}
                        </Text>
                    </TouchableOpacity>        
                ) : (
                    <TouchableOpacity style={styles.input}>
                        <Text style={{
                            color: '#f2f2f2',
                            fontSize: 16
                        }}>
                            Não a produto nessa categoria
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>
                    Quantidade
                </Text>

                <TextInput
                    style={[styles.input, {
                        width: '60%',
                        textAlign: 'center'
                    }]}
                    placeholderTextColor='#f0f0f0'
                    keyboardType='numeric'
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
                    <Feather
                        name='plus'
                        size={28}
                        color='#f2f2f2'
                    />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.btn, {
                        opacity: itens.length === 0 ? 0.3 : 1
                    }]}
                    disabled={itens.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text 
                        style={styles.btnText}
                    >
                        Avançar
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={modalCategory}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategory(false)}
                    options={category}
                    selectedItem={ handleChangeCategory }
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProduct}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalProduct(false)}
                    options={products}
                    selectedItem={ handleChangeProduct }
                />
            </Modal>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}
                data={itens}
                keyExtractor={(item) => item.id}
                renderItem={ ({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
            >

            </FlatList>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingVertical: '5%',
        paddingEnd: '5%',
        paddingStart: '5%',
        backgroundColor: '#1d1d2e',
        gap: 14
    },
    header:{
        flexDirection: 'row',
        marginBottom: 12,
        marginTop: 24,
        alignItems: 'center',
        gap: 12
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#f2f2f2'
    },
    inputContainer:{
        gap: 12
    },
    input:{
        backgroundColor: '#101026',
        borderRadius: 8,
        width: '100%',
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: '#f2f2f2',
        fontSize: 20
    },
    qtdContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f2f2f2'
    },
    actions:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btnAdd:{
        backgroundColor: '#3fd1ff',
        borderRadius: 8,
        height: 50,
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn:{
        backgroundColor: '#3fffa3',
        borderRadius: 8,
        height: 50,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText:{
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold'
    },
})