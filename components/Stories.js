import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { users } from '../datasets/usersData';

const Stories = () => {
  return (
    <View style={{ marginBottom: 13 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {users.map(user => (
          <View key={user.id} style={{ alignItems: 'center' }}>
            <Image source={{ uri: user.image }} style={styles.users} />
            <Text style={{ color: 'white' }}>
              {user.name.length > 11
                ? user.name.slice(0, 10).toLowerCase() + '...'
                : user.name.toLowerCase()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  container: {
    color: 'white',
  },
  users: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 3,
    borderColor: '#ff8501',
  },
});
