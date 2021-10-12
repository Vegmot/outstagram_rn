import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Divider } from 'react-native-elements';
import validUrl from 'valid-url';
import { firebase, db } from '../../firebase';

const placeholderUrl =
  'https://www.brownweinraub.com/wp-content/uploads/2017/09/placeholder.jpg';

const postSchema = Yup.object().shape({
  imageUrl: Yup.string().url().required('Image is required'),
  caption: Yup.string().max(2200, 'Text has reached the character limit'),
});

const PostForm = ({ navigation }) => {
  const [thumbnail, setThumbnail] = useState(placeholderUrl);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

  const getUsername = () => {
    const user = firebase.auth().currentUser;
    const unsubscribe = db
      .collection('users')
      .where('owner_uid', '==', user.uid)
      .limit(1)
      .onSnapshot(ss =>
        ss.docs.map(doc => {
          setCurrentLoggedInUser({
            username: doc.data().username,
            profileUrl: doc.data().profileUrl,
          });
        })
      );
    return unsubscribe;
  };

  useEffect(() => {
    getUsername();
  }, []);

  const uploadPost = (imageUrl, caption) => {
    const unsubscribe = db
      .collection('users')
      .doc(firebase.auth().currentUser.email)
      .collection('posts')
      .add({
        imageUrl: imageUrl,
        username: currentLoggedInUser.username,
        profileUrl: currentLoggedInUser.profileUrl,
        ownerUid: firebase.auth().currentUser.uid,
        ownerEmail: firebase.auth().currentUser.email,
        caption: caption,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        likesByUsers: [],
        comments: [],
      })
      .then(() => navigation.goBack());

    return unsubscribe;
  };

  return (
    <Formik
      initialValues={{ caption: '', imageUrl: '' }}
      onSubmit={values => {
        uploadPost(values.imageUrl, values.caption);
      }}
      validationSchema={postSchema}
      validateOnMount
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        errors,
        isValid,
      }) => (
        <>
          <View
            style={{
              margin: 20,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <Image
              source={{
                uri: validUrl.isUri(thumbnail) ? thumbnail : placeholderUrl,
              }}
              style={{ width: 100, height: 100 }}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <TextInput
                style={{ color: '#fff', fontSize: 20 }}
                placeholder="What's on your mind?"
                placeholderTextColor='gray'
                multiline
                onChangeText={handleChange('caption')}
                onBlur={handleBlur('caption')}
                value={values.caption}
              />
            </View>
          </View>

          <Divider width={0.2} orientation='vertical' />

          <TextInput
            onChange={e => setThumbnail(e.nativeEvent.text)}
            style={{ color: '#fff', fontSize: 18 }}
            placeholder='Enter image URL'
            placeholderTextColor='gray'
            onChangeText={handleChange('imageUrl')}
            onBlur={handleBlur('imageUrl')}
            value={values.imageUrl}
          />
          {errors.imageUrl && (
            <Text style={{ fontSize: 10, color: 'red' }}>
              {errors.imageUrl}
            </Text>
          )}

          <Button onPress={handleSubmit} title='Share' disabled={!isValid} />
        </>
      )}
    </Formik>
  );
};

export default PostForm;

const styles = StyleSheet.create({});
