import AsyncStorage from "@react-native-async-storage/async-storage";

export class LocalStorage {
  setItem = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  };

  getItem = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  };

  removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {}
  };

  mergeItem = async (key: string, value: string) => {
    try {
      await AsyncStorage.mergeItem(key, JSON.stringify(value));
    } catch (error) {}
  };

  clear = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {}
  };

  getAllKeys = async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      return [];
    }
  };

  getAllItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      return items.reduce<Record<string, any>>((accumulator, [key, value]) => {
        if (value !== null) {
          accumulator[key] = JSON.parse(value);
        }
        return accumulator;
      }, {});
    } catch (error) {
      return {};
    }
  };
}
