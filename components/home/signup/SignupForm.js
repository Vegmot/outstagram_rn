import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Validator from 'email-validator';
import { firebase, db } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';

const SignupForm = ({ navigation }) => {
  const signupFormSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    username: Yup.string()
      .required()
      .min(6, 'Username has to be at least 6 characters'),
    password: Yup.string()
      .required()
      .min(6, 'Password has to be at least 6 characters'),
  });

  const getRandomProfilePicture = async () => {
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json();
    return data.results[0].picture.large;
  };

  const onSignup = async (email, password, username) => {
    try {
      const authUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      console.log('Created a new user with firebase');

      db.collection('users')
        .doc(authUser.user.email)
        .set({
          owner_uid: authUser.user.uid,
          username,
          email: authUser.user.email,
          profileUrl: await getRandomProfilePicture(),
        });
    } catch (err) {
      Alert.alert('Oops!', err.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={values => {
          onSignup(values.email, values.password, values.username);
        }}
        validationSchema={signupFormSchema}
        validateOnMount
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.email.length < 1 || Validator.validate(values.email)
                      ? '#ccc'
                      : 'red',
                },
              ]}
            >
              <TextInput
                placeholder='Phone number, username or email'
                placeholderTextColor='#444'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                // autoFocus
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.username.length >= 6 || values.username.length < 1
                      ? '#ccc'
                      : 'red',
                },
              ]}
            >
              <TextInput
                placeholder='Username'
                placeholderTextColor='#444'
                autoCapitalize='none'
                textContentType='username'
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.password.length < 1 || values.password.length >= 6
                      ? '#ccc'
                      : 'red',
                },
              ]}
            >
              <TextInput
                placeholderTextColor='#444'
                placeholder='Password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry
                textContentType='password'
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
            </View>

            <Pressable
              titleSize={20}
              style={styles.button(isValid)}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>

            <View style={styles.signUpContainer}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.push('LoginScreen')}>
                <Text style={{ color: '#6bb0f5' }}>Log In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },
  inputField: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#fafafa',
    marginBottom: 10,
    borderWidth: 1,
  },
  button: isValid => ({
    backgroundColor: isValid ? '#0096f6' : '#9acaf7',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 4,
  }),
  buttonText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 18,
  },
  signUpContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 50,
  },
});
