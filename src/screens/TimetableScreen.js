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
    <View style={{ padding: 20, flex:1 }}>
      <Modal visible={showRoleModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>Are you a Teacher or Student?</Text>

            <ButtonCustom title={'I am a Teacher'} onPress={() => handleRoleSelection('Teacher')} />

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

            <ButtonCustom title={'I am a Student'} onPress={() => handleRoleSelection('Student')} />
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Welcome, {userRole}!</Text>
      <FlatList
        data={timetable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{`${item.subject} - ${item.time} (${item.date})`}</Text>
        )}
        ListFooterComponent={(
          <>
          {userRole === 'Teacher'  &&
          // <TouchableOpacity
          //   style={styles.manageBtn}
          //   onPress={() => navigation.navigate('ManageTimetable')}>
          //   <Text style={styles.btnTxt}>Manage Timetable</Text>
          // </TouchableOpacity>
          <ButtonCustom
            title={'Manage Timetable'}
            onPress={() => navigation.navigate('ManageTimetable')}
          />
          }
          <ButtonCustom 
            title={'Courses'}
            onPress={()=>navigation.navigate(constants.screens.COURSE_DETAILS)}
          />
          </>
        )}
      />
      
       <TouchableOpacity
          style={styles.changeRolesBtn}
          onPress={() => setShowRoleModal(true)}>
          <Text style={styles.btnTxt}>Change Roles</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom:100,
    width:160,
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
