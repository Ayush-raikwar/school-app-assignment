import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { ButtonCustom } from '../components/ButtonCustom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '../constants'; 
import { Title } from '../components/Title';

export const ManageTimetableScreen = () => {
  const [timetable, setTimetable] = useState([]);
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false)

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const timeOptions = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];

  
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const storedTimetable = await AsyncStorage.getItem(constants.TIME_TABLE);
        if (storedTimetable) {
          setTimetable(JSON.parse(storedTimetable));
        }
      } catch (error) {
        console.error('Error fetching timetable', error);
      }
    };

    fetchTimetable();
  }, []);

  
  const saveTimetable = async (updatedTimetable) => {
    try {
      await AsyncStorage.setItem(constants.TIME_TABLE, JSON.stringify(updatedTimetable));
    } catch (error) {
      console.error('Error saving timetable', error);
    }
  };

  
  const addTimetableEntry = () => {
    if (!subject || !time || !date) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const newTimetable = [
      ...timetable,
      {
        id: Date.now().toString(),
        subject,
        time,
        date: date.toISOString().split('T')[0], 
      },
    ];

    setTimetable(newTimetable);
    saveTimetable(newTimetable); 
    setSubject('');
    setTime('');
    setDate(new Date());
    setShowAddTableModal(false)
  };

  
  const deleteTimetableEntry = (id) => {
    const updatedTimetable = timetable.filter((entry) => entry.id !== id);
    setTimetable(updatedTimetable);
    saveTimetable(updatedTimetable); 
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false);
    setTime(option)
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Manage Timetable</Text>

        <Title text={'Time Tables'} />
        <FlatList
          data={timetable}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.subject}>{item.subject}</Text>
                <Text style={styles.time}>Time: {item.time}</Text>
                <Text style={styles.date}>Date: {item.date}</Text>
              </View>
              <Button
                title="Delete"
                onPress={() => deleteTimetableEntry(item.id)}
                color="red"
              />
            </View>
          )}
        />

        <ButtonCustom title="Add Timetable Entry" onPress={() => {
          setShowAddTableModal(true)
        }} />

      </View>
      <Modal visible={showAddTableModal} transparent animationType="slide">

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title text={'Add a timetable'} />
            <TextInput
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
              placeholder='Subject Name'
            />

            <View style={styles.datePicker}>
              <ButtonCustom
                title={`Select Date: ${date.toISOString().split('T')[0]}`}
                onPress={() => setOpenDatePicker(true)}
              />
              <DatePicker
                modal
                open={openDatePicker}
                date={date}
                mode='date'
                onConfirm={(selectedDate) => {
                  setDate(selectedDate);
                  setOpenDatePicker(false);
                }}
                onCancel={() => setOpenDatePicker(false)}
              />
            </View>

            <ButtonCustom dropdownBtn title={selectedOption || "Pick a Time slot"} onPress={() => setDropdownVisible((prev) => !prev)} />

            {isDropdownVisible && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={timeOptions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleOptionSelect(item)}>
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            <ButtonCustom title={'Add entry'} onPress={addTimetableEntry} />
          </View>
        </View>


      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    width: "100%",
    maxHeight: 150,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.4)',
    borderRadius: 4,
    padding: 8
  },
  datePicker: {
    marginVertical: 10, width:'100%'
  },
  timetableEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth:.5,
    borderColor:'rgba(0,0,0,.2)'
  },
  cardContent: {
    flex: 1,
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
});
