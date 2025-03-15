import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, PermissionsAndroid, Platform } from 'react-native';
// @ts-ignore
import SmsListener from 'react-native-android-sms-listener';
import * as SMS from 'expo-sms';
import { MapView, StyleImport, Camera } from '@rnmapbox/maps';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoiaGFyYmkiLCJhIjoiY202eG9pNWdiMDZxdDJqczFwd3c2M2c5NyJ9.YmjvpZ3NpixlofGvfBeM2g');

const App = () => {
  const [receivedMessage, setReceivedMessage] = useState(null);

  // Request necessary permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]);
      if (granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permissions Denied', 'SMS permissions are required for this feature to work.');
        return false;
      }
    }
    return true;
  };
  
  const sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'SMS is not available on this device.');
      return;
    }

    const { result } = await SMS.sendSMSAsync(
      ['+639667594716'],
      'Hello, this is a test message from Expo!'
    );

    if (result === 'sent') {
      Alert.alert('Success', 'Message sent successfully!');
    } else {
      Alert.alert('Error', 'Failed to send message.');
    }
  };

  useEffect(() => {
    const subscription = SmsListener.addListener((message) => {
      setReceivedMessage(message.body);
    });

    requestPermissions();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text>Waiting for incoming messages...</Text>
    //   {receivedMessage && (
    //     <Text style={{ marginTop: 20 }}>
    //       {receivedMessage}
    //     </Text>
    //   )}
    //   <Button title="Send SMS" onPress={() => sendSMS()} />
    // </View>
    <>
      <MapView
        style={styles.mapView}
        onPress={(feature) => console.log(feature)}
      >
        <Camera
          centerCoordinate={[125.61553087315934, 7.104253265127566]}
          animationDuration={10}
          zoomLevel={10}
        />
        {/* <StyleImport
          id="basemap"
          existing
          config={{
            lightPreset: 'light-v10',
          }}
        /> */}
      </MapView>
    </>
  );
};

const styles = {
  mapView: { flex: 1 },
};

export default App;