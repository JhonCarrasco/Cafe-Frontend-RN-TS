import {StackScreenProps} from '@react-navigation/stack'
import React, {useContext, useEffect} from 'react'
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Background from '../components/Background'
import WhiteLogo from '../components/WhiteLogo'
import {AuthContext} from '../context/AuthContext'
import {useForm} from '../hooks/useForm'
import {loginStyle} from '../theme/loginTheme'

interface Props extends StackScreenProps<any, any> {}

interface Form {
  email: string
  password: string
}

const LoginScreen = ({navigation}: Props) => {
  const {signIn, removeError, errorMessage} = useContext(AuthContext)

  const {
    form: {email, password},
    onChange,
  } = useForm<Form>({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (errorMessage === null) {
      return
    }
    Alert.alert('Incorrect Login', errorMessage, [
      {
        text: 'OK',
        onPress: removeError,
      },
    ])
  }, [errorMessage])

  const onLogin = () => {
    Keyboard.dismiss()
    signIn({correo: email, password})
  }

  return (
    <>
      {/* Background */}
      <Background />

      {/* Keyboard avoid view */}
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // evitar sobreponer el teclado en los componentes
      >
        <View style={loginStyle.formContainer}>
          <WhiteLogo />

          <Text style={loginStyle.title}>Login</Text>
          <Text style={loginStyle.label}>Email:</Text>
          <TextInput
            placeholder="Ingrese su email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onLogin}
            keyboardType="email-address"
            keyboardAppearance="dark"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
              ,
            ]}
            selectionColor="white"
          />
          <Text style={loginStyle.label}>Contraseña:</Text>
          <TextInput
            placeholder="******"
            placeholderTextColor="rgba(255,255,255,0.4)"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            secureTextEntry
            onSubmitEditing={onLogin}
            keyboardType="numeric"
            keyboardAppearance="dark"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
              ,
            ]}
            selectionColor="white"
          />

          {/* Botón login */}
          <View style={loginStyle.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onLogin}
              style={loginStyle.button}>
              <Text style={loginStyle.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Crear nueva cuenta */}
          <View style={loginStyle.registerButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('RegisterScreen')}>
              <Text
                style={[
                  loginStyle.buttonText,
                  {textDecorationLine: 'underline'},
                ]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
