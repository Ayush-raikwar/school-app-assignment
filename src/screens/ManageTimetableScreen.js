import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { TextInput, Menu, Provider } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { ButtonCustom } from '../components/ButtonCustom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '../constants'; // Assuming you have constants defined

export const ManageTimetableScreen = () => {
  const [timetable, setTimetable] = useState([]);
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [menuVisible, setMenuVisible] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const timeOptions = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];

  // Load timetable from AsyncStorage when the component mounts
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

  // Save the timetable to AsyncStorage
  const saveTimetable = async (updatedTimetable) => {
    try {
      await AsyncStorage.setItem(constants.TIME_TABLE, JSON.stringify(updatedTimetable));
    } catch (error) {
      console.error('Error saving timetable', error);
    }
  };

  // Add a new timetable entry
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
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      },
    ];

    setTimetable(newTimetable);
    saveTimetable(newTimetable); // Save to AsyncStorage
    setSubject('');
    setTime('');
    setDate(new Date());
  };

  // Delete a timetable entry
  const deleteTimetableEntry = (id) => {
    const updatedTimetable = timetable.filter((entry) => entry.id !== id);
    setTimetable(updatedTimetable);
    saveTimetable(updatedTimetable); // Save to AsyncStorage
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.heading}>Manage Timetable</Text>

        {/* Subject Input */}
        <TextInput
          label="Subject"
          mode="outlined"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
        />

        {/* Date Button */}
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

        {/* Time Button */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <ButtonCustom 
              title={time || 'Select Time'}
              onPress={() => setMenuVisible(true)}
             />
          }
        >
          {timeOptions.map((option, index) => (
            <Menu.Item
              key={index}
              onPress={() => {
                setTime(option);
                setMenuVisible(false);
              }}
              title={option}
            />
          ))}
        </Menu>

        {/* Add Timetable Entry */}
        <ButtonCustom title="Add Timetable Entry" onPress={addTimetableEntry}/>

        {/* Timetable List */}
        <FlatList
          data={timetable}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.timetableEntry}>
              <Text>{`${item.subject} - ${item.time} (${item.date})`}</Text>
              <Button
                title="Delete"
                onPress={() => deleteTimetableEntry(item.id)}
                color="red"
              />
            </View>
          )}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
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
  },
  datePicker: {
    marginVertical: 10,
  },
  timetableEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
