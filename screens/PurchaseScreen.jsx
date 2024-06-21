import React, { useState, useLayoutEffect } from 'react';
import { Alert, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function PurchaseScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
          headerBackTitleVisible: false,
          headerTitle: 'Purchase',
          headerTintColor: '#333',
        });
    }, [navigation]);

    // Submit purchase function
    const submitPurchase = () => {
        // Example faux credit card data
        const cardHolderName = "Jon Snow";
        const fauxCardNumber = "4242424242424242"; // Commonly used test card number
        const fauxExpiryDate = "1224"; // MMYY format
        const fauxCvv = "123";

        if (cardHolderName === fullName && cardNumber === fauxCardNumber && expiryDate === fauxExpiryDate && cvv === fauxCvv) {
            Alert.alert("Transaction Successful", "Your purchase has been processed successfully.");
        } else {
            Alert.alert("Transaction Failed", "Invalid credit card information.");
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Purchase</Text>
                <TextInput
                    placeholder="Full Name (as it appears on card)"
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Card Number"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Expiry Date"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    secureTextEntry
                    style={styles.input}
                />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.total}>Total:</Text>
                    <Text style={styles.total}>USD ${route.params ? route.params.totalPrice.toFixed(2) : '0.00'}</Text>
                </View>
                <TouchableOpacity style={styles.purchaseButton} onPress={() => submitPurchase()}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    bottomContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    totalContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
    },
    purchaseButton: {
        backgroundColor: 'black',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    }, 
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#EFEFEF',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});