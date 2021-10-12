// 04:53:15

import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/home/Header';
import Stories from '../components/Stories';
import Post from '../components/home/Post';
import BottomTab from '../components/home/BottomTab';
import { bottomTabIcons } from '../datasets/bottomTab';
import { db } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collectionGroup('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(ss => {
        setPosts(ss.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <Stories />
      <ScrollView>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </ScrollView>
      <BottomTab icons={bottomTabIcons} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
});

export default HomeScreen;
