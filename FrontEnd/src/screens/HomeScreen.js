import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchData } from '../api'; // Backend API call

const HomeScreen = () => {
    const [followers, setFollowers] = useState([]);

    // Fetch data from the backend
    useEffect(() => {
        const loadFollowers = async () => {
            try {
                const response = await fetchData();
                setFollowers(response.following || []); // Replace `following` with the correct key from your API
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        loadFollowers();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Followers</Text>
            <FlatList
                data={followers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item.UserName} - {item.Date}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default HomeScreen;