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
import { firebase } from '../../firebase';

const LoginForm = ({ navigation }) => {
  const loginFormSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string()
      .required()
      .min(6, 'Password has to be at least 6 characters'),
  });

  const onLogin = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('Logged in with firebase');
    } catch (err) {
      Alert.alert(
        'Oops!',
        err.message + '\n\nPlease check email/password again, or sign up',
        [
          {
            text: 'OK',
            onPress: () => console.log('Tapped OK'),
            style: 'cancel',
          },
          {
            text: 'Sign Up',
            onPress: () => navigation.push('SignupScreen'),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={values => {
          onLogin(values.email, values.password);
        }}
        validationSchema={loginFormSchema}
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

            <View
              style={{
                alignItems: 'flex-end',
                marginBottom: 30,
                marginRight: 6,
              }}
            >
              <Text style={{ color: '#6bb0f5' }}>Forgot password?</Text>
            </View>

            <Pressable
              titleSize={20}
              style={styles.button(isValid)}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </Pressable>

            <View style={styles.signUpContainer}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.push('SignupScreen')}>
                <Text style={{ color: '#6bb0f5' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginForm;

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
