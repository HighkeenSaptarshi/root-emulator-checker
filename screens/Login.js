import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import {
  Alert,
  Box,
  Button,
  Center,
  CloseIcon,
  HStack,
  IconButton,
  Input,
  NativeBaseProvider,
  ScrollView,
  Stack,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Keyboard,
  Linking,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  APP_VERSION,
  AccessToken,
  BASE_URL,
  OS_TYPE,
  hashKey,
  secretKey,
} from '../auth_provider/Config';
import {useTranslation} from 'react-i18next';
import {
  MainStyle,
  baseColor,
  dangerColor,
  darkColor,
  darkGrey,
  fontBold,
  fontRegular,
  fontSemiBold,
  greyColor,
  lightColor,
  lightGrey,
  successColor,
  warningColor,
} from '../assets/MainStyle';
//import { getHash, getOtp, startOtpListener } from 'react-native-otp-verify';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import {OtpInput} from 'react-native-otp-entry';
import Events from '../auth_provider/Events';
//import CountDown from 'react-native-countdown-component';

import CRC32 from 'crc-32';
import {fetch} from 'react-native-ssl-pinning';
import apiClient from '../api/apiClient';
const LoginScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [currentLanguage, setLanguage] = React.useState('Eng');
  const [forOTP, setForOTP] = React.useState(false);
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [otpValue, setOtpValue] = React.useState('');
  const [otpArrya, setOtpArrya] = React.useState([]);
  const [isResend, setIsResend] = React.useState(false);
  const [timer, setTimer] = React.useState(3);

  const [pendingPop, setPendingPop] = React.useState(false);

  const [isAccept, setIsAccept] = React.useState(false);

  const [officerName, setOfficerName] = React.useState('');
  const [officerPhone, setOfficerPhone] = React.useState('');
  const [officerType, setOfficerType] = React.useState('');

  const [alertColor, setAlertColor] = React.useState(false);

  const regexNum = /^[6-9]\d{9}$/;

  /* const [minutes, setMinutes] = React.useState(1);
    const [seconds, setSeconds] = React.useState(0);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    }); */

  const sendOtp = () => {
    if (mobileNumber.trim() == '') {
      if (route.params.type == 'Contractor') {
        Toast.show(t('Please enter Mobile Number'), Toast.LONG);
      } else if (route.params.type == 'Dealer') {
        Toast.show(t('Please enter Member Id / SAP Id'), Toast.LONG);
      } else {
        Toast.show(t('Please enter Employee Id'));
      }
    } else if (route.params.type == 'Contractor' && mobileNumber.length < 10) {
      Toast.show(t('Please enter 10 digit for Phone Number'), Toast.LONG);
    } else if (
      route.params.type == 'Contractor' &&
      mobileNumber != '' &&
      !regexNum.test(mobileNumber)
    ) {
      Toast.show(
        t('Mobile Number accept Only Number / Mobile No. not Valid'),
        Toast.LONG,
      );
    } else if (!isAccept) {
      Toast.show(t('Please Accept Terms & Conditions'), Toast.LONG);
      setAlertColor(true);
    } else {
      setAlertColor(false);
      setLoading(true);
      let formdata = new FormData();
      formdata.append('mobileNumber', mobileNumber);
      formdata.append('lang_code', currentLanguage);
      formdata.append('userType', route.params.type);
      // fetch(`${BASE_URL}/login/get-otp`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     accesstoken: `${AccessToken}`,
      //   },
      //   pkPinning: true,
      //   sslPinning: {
      //     certs: [
      //       'sha256/UvVQCYbTtiOChjyEmasVWFI2arIt406Z9tmpPZSjsos=',
      //       'sha256/E3tYcwo9CiqATmKtpMLW5V+pzIq+ZoDmpXSiJlXGmTo=',
      //       'sha256/i7WTqTvh0OioIruIfFR4kMPnBqrS2rdiVPl/s2uC/CY=',
      //     ],
      //   },
      //   body: formdata,
      // })

      apiClient
        .post('https://apisheecementuat.mjunction.in/login/get-otp', {
          formdata,
        })
        .then(response => {
          console.log('RESSS:: ', response);
          return response;
        })
        .then(responseJson => {
          setLoading(false);
          if (responseJson.bstatus == 1) {
            console.log('RES 1');
            Toast.show(responseJson.message, Toast.LONG);
            if (responseJson.eligable_for_login == 1) {
              console.log('RES 2');
              setForOTP(true);
              setOtpValue(responseJson.OTP);
              var myArray = responseJson.OTP.split('');
              setOtpArrya(myArray);
            } else {
              console.log('RES 3');
              setPendingPop(true);
              setOfficerName(responseJson.officerName);
              setOfficerPhone(responseJson.officerNumber);
              setOfficerType(responseJson.officerType);
            }
          } else {
            console.log('RES 4');
            Toast.show(responseJson.message, Toast.LONG);
          }
        })
        .catch(error => {
          console.log('INSIDE CATCH', error);
          setLoading(false);
          if (error.toString().includes('Network request failed')) {
            Alert.alert(
              'Secure connection error or network issue! Please try again later.',
            );
            console.log(
              'Secure connection error or network issue! Please try again later.',
            );
          } else {
            console.log('Error:', error);
          }
          //console.log('Error:', error);
          navigation.replace('Splash');
          BackHandler.exitApp();
        });
      /* .then((response) => {
                var serverHash = response.headers.get('X-Hash-Value');
                var responseJson = response.json();

                const checksum = CRC32.str(hashKey);
                const finalChecksum = (checksum >>> 0).toString(16).padStart(8, '0');
                if (serverHash === finalChecksum) {
                    setLoading(false);
                    console.log("Get OTP:", responseJson);
                    if (responseJson.bstatus == 1) {
                        Toast.show(responseJson.message, Toast.LONG);
                        if (responseJson.eligable_for_login == 1) {
                            setForOTP(true);
                            setOtpValue(responseJson.OTP);
                            var myArray = responseJson.OTP.split('');
                            setOtpArrya(myArray);
                        } else {
                            setPendingPop(true);
                            setOfficerName(responseJson.officerName);
                            setOfficerPhone(responseJson.officerNumber);
                            setOfficerType(responseJson.officerType);
                        }
                    } else {
                        Toast.show(responseJson.message, Toast.LONG);
                    }
                } else {
                    setLoading(false);
                    //BackHandler.exitApp();
                }

                return response.json();
            }).then(responseJson => {
                console.log(data); // Use the data
            }).catch((error) => {
                setLoading(false);
                console.log("Error:", error);
                //Toast.show(t("Sorry! Somthing went Wrong. Maybe Network request Failed"));
            }); */
    }
  };

  const onVerify = () => {
    Keyboard.dismiss();
    if (otpValue == '') {
      Toast.show(t('Please enter OTP Number'), Toast.LONG);
    } else {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('mobileNumber', mobileNumber);
      formdata.append('otp', otpValue);
      formdata.append('os_type', `${OS_TYPE}`);
      formdata.append('os_version', `${APP_VERSION}`);
      formdata.append('lang_code', currentLanguage);
      fetch(`${BASE_URL}/login/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          accesstoken: `${AccessToken}`,
        },
        pkPinning: true,
        sslPinning: {
          certs: [
            'sha256/UvVQCYbTtiOChjyEmasVWFI2arIt406Z9tmpPZSjsos=',
            'sha256/E3tYcwo9CiqATmKtpMLW5V+pzIq+ZoDmpXSiJlXGmTo=',
            'sha256/i7WTqTvh0OioIruIfFR4kMPnBqrS2rdiVPl/s2uC/CY=',
          ],
        },
        body: formdata,
      })
        .then(response => {
          var serverHash = response.headers['X-Hash-Value'];
          var responseJson = JSON.parse(response.bodyString);
          const checksum = CRC32.str(hashKey);
          const finalChecksum = (checksum >>> 0).toString(16).padStart(8, '0');
          if (serverHash === finalChecksum) {
            if (responseJson.bstatus == 1) {
              Toast.show(responseJson.message, Toast.LONG);
              setForOTP(false);
              if (responseJson.eligable_for_login == 1) {
                getUserData(responseJson.token);
                Events.publish('token', responseJson.token);
                setMobileNumber('');
                setOtpValue('');
              } else {
                setLoading(false);
                const checksum = CRC32.str(
                  responseJson.status +
                    '~' +
                    responseJson.bstatus +
                    '~' +
                    `${AccessToken}` +
                    '~' +
                    mobileNumber +
                    '~' +
                    otpValue,
                );
                const finalChecksum = (checksum >>> 0)
                  .toString(16)
                  .padStart(8, '0');
                if (responseJson.checksum === finalChecksum) {
                  navigation.navigate('Registration', {mobile: mobileNumber});
                  setMobileNumber('');
                  setOtpValue('');
                }
              }
            } else {
              setLoading(false);
              Toast.show(responseJson.message, Toast.LONG);
            }
          } else {
            setLoading(false);
            //navigation.replace('Splash');
            //BackHandler.exitApp();
            //BackHandler.exitApp();
          }
        })
        .catch(error => {
          setLoading(false);
          console.log('login Error:', error);
          Toast.show(
            t('Sorry! Somthing went Wrong. Maybe Network request Failed'),
          );
        });
    }
  };

  const getUserData = token => {
    fetch(`${BASE_URL}/get-user-after-login-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${AccessToken}`,
        Useraccesstoken: token,
      },
      pkPinning: true,
      sslPinning: {
        certs: [
          'sha256/UvVQCYbTtiOChjyEmasVWFI2arIt406Z9tmpPZSjsos=',
          'sha256/E3tYcwo9CiqATmKtpMLW5V+pzIq+ZoDmpXSiJlXGmTo=',
          'sha256/i7WTqTvh0OioIruIfFR4kMPnBqrS2rdiVPl/s2uC/CY=',
        ],
      },
      body: '',
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        if (responseJson.bstatus === 1) {
          var CryptoJS = require('crypto-js');
          var encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(responseJson),
            secretKey,
          ).toString();
          AsyncStorage.setItem('userToken', encryptedData);
          navigation.replace('Home');
        } else {
          Toast.show(responseJson.message, Toast.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('after login Error:', error);
      });
  };

  const onOkay = () => {
    setPendingPop(false);
    navigation.goBack();
  };

  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" backgroundColor={lightColor} />
      <VStack flex={1} backgroundColor={lightColor}>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <VStack space={5} alignItems="center">
            <Image
              source={require('../assets/images/construction.jpg')}
              style={{
                width: '100%',
                height: 400,
                resizeMode: 'cover',
                position: 'relative',
              }}
            />
            <Image
              source={require('../assets/images/logo.jpg')}
              style={MainStyle.logo}
            />
          </VStack>
          <VStack space={5} paddingX={10} paddingY={5}>
            <Text
              color={darkColor}
              fontFamily={fontBold}
              fontSize="lg"
              textAlign="center">
              {route.params.pageName == 'Sign In'
                ? t('Please Signin to your account')
                : t('Please Sign Up to new account')}
            </Text>
            <Stack space={3}>
              {route.params.type == 'Contractor' ? (
                <View>
                  <Text style={MainStyle.lable} fontSize="xs">
                    {t('Mobile Number')} <Text color={dangerColor}>*</Text>
                  </Text>
                  <View style={MainStyle.inputbox}>
                    {!forOTP ? (
                      <Input
                        height={43}
                        fontFamily={fontRegular}
                        size="md"
                        variant="unstyled"
                        keyboardType="number-pad"
                        maxLength={10}
                        onChangeText={text => setMobileNumber(text)}
                        placeholder={t('Please Enter Mobile Number')}
                      />
                    ) : (
                      <Input
                        height={43}
                        backgroundColor={lightGrey}
                        fontFamily={fontRegular}
                        size="md"
                        variant="unstyled"
                        value={mobileNumber}
                        readOnly
                        InputRightElement={
                          <Icon
                            name="checkmark-circle"
                            size={22}
                            color={successColor}
                            style={{marginRight: 10, textAlign: 'center'}}
                          />
                        }
                      />
                    )}
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={MainStyle.lable} fontSize="xs">
                    {route.params.type == 'Dealer'
                      ? t('Member Id / SAP Id')
                      : t('Employee Id')}{' '}
                    <Text color={dangerColor}>*</Text>
                  </Text>
                  <View style={MainStyle.inputbox}>
                    {!forOTP ? (
                      <Input
                        height={43}
                        fontFamily={fontRegular}
                        size="md"
                        variant="unstyled"
                        onChangeText={text => setMobileNumber(text)}
                        placeholder={
                          route.params.type == 'Dealer'
                            ? t('Please enter  Member / SAP Id')
                            : t('Please enter Employee Id')
                        }
                      />
                    ) : (
                      <Input
                        height={43}
                        backgroundColor={lightGrey}
                        fontFamily={fontRegular}
                        size="md"
                        variant="unstyled"
                        value={mobileNumber}
                        readOnly
                        InputRightElement={
                          <Icon
                            name="checkmark-circle"
                            size={22}
                            color={successColor}
                            style={{marginRight: 10, textAlign: 'center'}}
                          />
                        }
                      />
                    )}
                  </View>
                </View>
              )}
              {forOTP && (
                <View>
                  <Text style={MainStyle.lable} fontSize="xs">
                    {t('OTP')}{' '}
                    <Text color={darkGrey} fontSize="10">
                      ({t('To Verify Mobile No.')})
                    </Text>{' '}
                    <Text color={dangerColor}>*</Text>
                  </Text>
                  <HStack justifyContent="space-between" alignItems="center">
                    <View style={MainStyle.inputbox} width={150}>
                      <Input
                        height={43}
                        value={otpValue}
                        fontFamily={fontBold}
                        size="xl"
                        letterSpacing={5}
                        variant="unstyled"
                        keyboardType="number-pad"
                        secureTextEntry={true}
                        maxLength={6}
                        onChangeText={text => setOtpValue(text)}
                      />
                    </View>
                    {/* {minutes === 0 && seconds === 0 ? null : <Text> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>} */}
                    {/* <CountDown
                                            until={60 * timer}
                                            size={14}
                                            onFinish={() => { setIsResend(true), setTimer(0) }}
                                            digitStyle={{ backgroundColor: '#eeeeee' }}
                                            digitTxtStyle={{ color: '#1CC625' }}
                                            timeToShow={['M', 'S']}
                                            timeLabels={{ m: '', s: '' }}
                                            showSeparator
                                        /> */}
                    <Button variant="unstyled" onPress={() => sendOtp()}>
                      <Text
                        color={baseColor}
                        fontFamily={fontSemiBold}
                        fontSize="sm">
                        {t('Resend')}
                      </Text>
                    </Button>
                  </HStack>
                </View>
              )}
              <VStack space={2}>
                {!forOTP && (
                  <Stack space={3} marginTop={5}>
                    <HStack space={1} alignItems="center" paddingRight={2}>
                      <CheckBox
                        value={isAccept}
                        onValueChange={() => setIsAccept(!isAccept)}
                        tintColors={{true: successColor}}
                      />
                      <TouchableOpacity
                        onPress={() => navigation.navigate('TermsConditions')}
                        style={{width: '90%'}}>
                        <Text
                          fontSize="xs"
                          fontFamily={fontRegular}
                          color={alertColor ? dangerColor : darkColor}>
                          {t('I accept the')}{' '}
                          <Text
                            fontSize="xs"
                            fontFamily={fontBold}
                            style={{textDecorationLine: 'underline'}}>
                            {t('terms & conditions and privacy policy')}
                          </Text>{' '}
                          {t('of use')}
                        </Text>
                      </TouchableOpacity>
                    </HStack>

                    <Button
                      style={MainStyle.solidbtn}
                      onPress={() => sendOtp()}>
                      <Text
                        color={lightColor}
                        fontFamily={fontSemiBold}
                        fontSize="sm">
                        {t('Get OTP')}
                      </Text>
                    </Button>
                  </Stack>
                )}
                {forOTP && (
                  <Button
                    marginTop={3}
                    style={MainStyle.solidbtn}
                    onPress={() => onVerify()}>
                    <Text
                      color={lightColor}
                      fontFamily={fontSemiBold}
                      fontSize="sm">
                      {t('Verify OTP')}
                    </Text>
                  </Button>
                )}
                <Button
                  variant="unstyled"
                  backgroundColor={greyColor}
                  borderRadius={8}
                  onPress={() => navigation.replace('Intro')}>
                  <Text
                    color={darkColor}
                    fontFamily={fontSemiBold}
                    fontSize="xs">
                    {t('Go Back')}
                  </Text>
                </Button>
              </VStack>
            </Stack>
          </VStack>
        </ScrollView>
      </VStack>
      {pendingPop && (
        <View style={MainStyle.spincontainer}>
          <VStack style={MainStyle.popbox} space={10}>
            <Image
              source={require('../assets/images/hour.gif')}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
                position: 'relative',
                marginTop: 30,
              }}
            />
            <Image
              source={require('../assets/images/logo.jpg')}
              style={MainStyle.logo}
            />
            <VStack justifyContent="center" alignItems="center">
              <Text
                color={darkGrey}
                fontSize="sm"
                fontFamily={fontSemiBold}
                textAlign="center">
                {t('Your registration approval is pending with')}{' '}
                <Text fontSize="sm" fontFamily={fontBold}>
                  {officerType} {officerName}
                </Text>
              </Text>
              <HStack
                marginTop={4}
                space={2}
                justifyContent="center"
                alignItems="center">
                <Text color={darkGrey} fontSize="sm" fontFamily={fontSemiBold}>
                  {t('Contact No:')}
                </Text>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${officerPhone}`)}>
                  <HStack alignItems="center">
                    <Icon name="call" size={16} color={baseColor} />
                    <Text color={baseColor} fontSize="sm" fontFamily={fontBold}>
                      {' '}
                      {officerPhone}
                    </Text>
                  </HStack>
                </Pressable>
              </HStack>
            </VStack>
            <Button
              style={MainStyle.solidbtn}
              width={'100%'}
              onPress={() => onOkay()}>
              <Text color={lightColor} fontFamily={fontSemiBold} fontSize="sm">
                {t('Okay')}
              </Text>
            </Button>
          </VStack>
        </View>
      )}
      {loading && (
        <View style={MainStyle.spincontainer}>
          <ActivityIndicator
            animating={loading}
            size="large"
            color={warningColor}
          />
        </View>
      )}
    </NativeBaseProvider>
  );
};

/* const styles = StyleSheet.create({
}); */

export default LoginScreen;
