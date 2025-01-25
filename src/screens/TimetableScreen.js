import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { constants, defaultTimetable } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonCustom } from '../components/ButtonCustom';
import LottieView from 'lottie-react-native';
import { Title } from '../components/Title';

export const TimetableScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [teacherCode, setTeacherCode] = useState('');
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedRole = await AsyncStorage.getItem(constants.USER_ROLE);
        if (storedRole) {
          setUserRole(storedRole);
        } else {
          setShowRoleModal(true);
        }

        const storedTimetable = await AsyncStorage.getItem(constants.TIME_TABLE);
        if (storedTimetable) {
          setTimetable(JSON.parse(storedTimetable));
        } else {
          await AsyncStorage.setItem('timetable', JSON.stringify(defaultTimetable));
          setTimetable(defaultTimetable);
        }
      } catch (error) {
        console.error('Initialization error', error);
      }
    };

    initializeApp();
  }, []);

  // generateContent('is earth flat').then(val=>console.log('hi', JSON.stringify(val?.candidates[0]?.content?.parts[0]?.text)))
  const handleRoleSelection = async (role) => {
    setTeacherCode(null)
    if (role === 'Teacher') {
      setUserRole('Teacher');
    } else {
      await AsyncStorage.setItem('userRole', 'Student');
      setUserRole('Student');
      setShowRoleModal(false);
      Alert.alert('Welcome', 'You have student access.');
    }
  };

  const handleTeacherVerification = async () => {
    if (teacherCode === '1234') {
      await AsyncStorage.setItem('userRole', 'Teacher');
      setShowRoleModal(false);
      Alert.alert('Access Granted', 'Welcome, Teacher!');
    } else {
      Alert.alert('Access Denied', 'Incorrect code. Please try again.');
    }
    setTeacherCode(null)
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Modal visible={showRoleModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {userRole === 'Teacher' && (
              <>
                <Text style={styles.subheading}>Enter Teacher Code:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 4-character code"
                  value={teacherCode}
                  onChangeText={setTeacherCode}
                  secureTextEntry
                />
                <ButtonCustom title="Submit" onPress={handleTeacherVerification} />
              </>
            )}
            <Text style={styles.heading}>Are you a Teacher or Student?</Text>
            <ButtonCustom title={'I am a Teacher'} onPress={() => handleRoleSelection('Teacher')} />


            <ButtonCustom title={'I am a Student'} onPress={() => handleRoleSelection('Student')} />
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Welcome, {userRole}!</Text>
      <Title text={'Time Tables'} />
      <FlatList
        data={timetable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.time}>Time: {item.time}</Text>
            <Text style={styles.date}>Date: {item.date}</Text>
          </View>
        )}
      />
      <>
        {userRole === 'Teacher' && (
          <ButtonCustom
            title={'Manage Timetable'}
            onPress={() => navigation.navigate('ManageTimetable')}
          />
        )}
      </>
      <ButtonCustom
        title={'Courses'}
        onPress={() => navigation.navigate(constants.screens.COURSE_DETAILS)}
      />
      <TouchableOpacity
        style={styles.changeRolesBtn}
        onPress={() => setShowRoleModal(true)}>
        <Text style={styles.btnTxt}>Change Roles</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(constants.screens.AI_CHAT)}
        style={styles.lottieContainer}>
        <Text style={styles.askGemini}>Ask</Text>
        <LottieView
          source={require('../assets/animations/gemini_animation.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </TouchableOpacity>
      <Text style={styles.copyright}>Assignment by Ayush Raikwar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  copyright: {
    fontSize:12,color:'rgba(0,0,0,.25)', textAlign:'center'
  },
  askGemini: {
    fontSize: 16, fontWeight: '600', color: 'rgba(114, 112, 112, 0.83)',
    position:'absolute', top:10
  },
  lottieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'rgba(255,255,255,.95)',
    borderRadius: 200,
    width: 240,
    margin: 'auto',
    position:'relative',
    paddingTop:4
  },
  lottie: { width: 120, height: 110 },
  title: {
    fontSize: 20,
    marginBottom: 22,
    fontWeight: '700',
  },
  btnTxt: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  manageBtn: {
    backgroundColor: 'rgba(10, 137, 255, 0.9)',
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
  },
  changeRolesBtn: {
    backgroundColor: 'rgba(10, 137, 255, 0.9)',
    padding: 12,
    borderRadius: 4,
    marginBottom: 100,
    width: 160,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    borderWidth:.5,
    borderColor:'rgba(0,0,0,.2)'
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#777',
  },
  title: {
    fontSize: 20,
    marginBottom: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  btnTxt: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  manageBtn: {
    backgroundColor: 'rgba(10, 137, 255, 0.9)',
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
  },
  changeRolesBtn: {
    backgroundColor: 'rgba(10, 137, 255, 0.9)',
    padding: 12,
    borderRadius: 4,
    marginBottom: 100,
    width: 160,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
