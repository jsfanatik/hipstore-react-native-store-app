import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Avatar, Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

export default function Splash() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        const user = {
            email: 'Test@test.com',
            password: 'password123',
        }
        if (user.email === email && user.password === password) {
            SecureStore.setItemAsync('user', JSON.stringify(user));
            navigation.navigate('HomeScreen');
        } else {
            Alert.alert('Error', 'Invalid email or password. Please try again.');
        }
    }
    
    return (
        <View style={styles.contentContainer}>
            <Text style={{textAlign: 'center', color: '#222', fontSize: 32, fontWeight: 'bold', marginBottom: 24}}>Welcome to Hipstore!</Text>
            <Avatar.Image style={styles.image} size={120} source={require('../assets/images/hipstore-logo.jpeg')} />
            <TextInput
                mode="outlined"
                value={email}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                style={styles.input}
                theme={{ roundness: 25 }}
            />
            <TextInput
                mode="outlined"
                value={password}
                    placeholder="Password"
                    onChangeText={text => setPassword(text)}
                    secureTextEntry={true}
                    style={styles.input}
                theme={{ roundness: 25 }}
            />
            <Button style={styles.button} mode="contained" onPress={login}>
                Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    linearGradient: {
        flex: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    input: {
        marginTop: 16,
        borderRadius: 5, // Border radius for rounded corners
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#fff',
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        borderRadius: 25,
        paddingVertical: 5,
        backgroundColor: '#555',
    },
    image: {
        alignSelf: 'center',
        marginBottom: 30,
        borderWidth: 0,
    }
});
