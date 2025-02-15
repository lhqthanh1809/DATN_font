import messaging from "@react-native-firebase/messaging";

export default class FCMService {
  public async getToken() : Promise<string | null>   {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      return token
    }
    return null
  }
}