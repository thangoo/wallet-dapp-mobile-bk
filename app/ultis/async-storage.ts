import AsyncStorage from '@react-native-async-storage/async-storage';

const setPopupSuccess = async (set: 'TRUE' | null) => {
  if (set) {
    await AsyncStorage.setItem('popupSuccess', set);
  } else {
    await AsyncStorage.removeItem('popupSuccess');
  }
};

const getPopupSuccess = async () => {
  const res = await AsyncStorage.getItem('popupSuccess');
  return res as string;
};

export { setPopupSuccess, getPopupSuccess };
