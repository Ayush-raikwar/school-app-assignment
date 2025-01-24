// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { constants } from '../constants';

// export const CourseDetailsScreen = () => {
//   const [userRole, setUserRole] = useState(null);
//   const [courses, setCourses] = useState([
//     { id: '1', name: 'Math', description: 'Algebra and Geometry', assignedTeacher: 'Mr. Smith' },
//     { id: '2', name: 'Science', description: 'Physics and Chemistry', assignedTeacher: 'Mrs. Johnson' },
//   ]);

//   const [courseName, setCourseName] = useState('');
//   const [courseDescription, setCourseDescription] = useState('');
//   const [assignedTeacher, setAssignedTeacher] = useState('');

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const storedRole = await AsyncStorage.getItem(constants.USER_ROLE);
//         setUserRole(storedRole);
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   // Function to add a new course
//   const addCourse = () => {
//     if (!courseName || !courseDescription || !assignedTeacher) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     const newCourse = {
//       id: Date.now().toString(),
//       name: courseName,
//       description: courseDescription,
//       assignedTeacher,
//     };

//     setCourses([...courses, newCourse]);
//     setCourseName('');
//     setCourseDescription('');
//     setAssignedTeacher('');
//   };

//   // Function to update a course
//   const updateCourse = (id) => {
//     const updatedCourses = courses.map(course => 
//       course.id === id 
//       ? { ...course, name: courseName, description: courseDescription, assignedTeacher }
//       : course
//     );
//     setCourses(updatedCourses);
//     setCourseName('');
//     setCourseDescription('');
//     setAssignedTeacher('');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Course Details</Text>

//       <FlatList
//         data={courses}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.courseItem}>
//             <Text style={styles.courseText}>{`Course: ${item.name}`}</Text>
//             <Text>{`Description: ${item.description}`}</Text>
//             <Text>{`Assigned Teacher: ${item.assignedTeacher}`}</Text>

//             {userRole === 'Teacher' && (
//               <View style={styles.editContainer}>
//                 <Button title="Edit" onPress={() => {
//                   setCourseName(item.name);
//                   setCourseDescription(item.description);
//                   setAssignedTeacher(item.assignedTeacher);
//                   updateCourse(item.id);
//                 }} />
//               </View>
//             )}
//           </View>
//         )}
//       />

//       {userRole === 'Teacher' && (
//         <View style={styles.addCourseContainer}>
//           <TextInput
//             placeholder="Course Name"
//             value={courseName}
//             onChangeText={setCourseName}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Course Description"
//             value={courseDescription}
//             onChangeText={setCourseDescription}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Assigned Teacher"
//             value={assignedTeacher}
//             onChangeText={setAssignedTeacher}
//             style={styles.input}
//           />
//           <Button title="Add Course" onPress={addCourse} />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   courseItem: {
//     marginBottom: 15,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   courseText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   editContainer: {
//     marginTop: 10,
//   },
//   addCourseContainer: {
//     marginTop: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '../constants';
import { ButtonCustom } from '../components/ButtonCustom';

export const CourseDetailsScreen = () => {
  const [userRole, setUserRole] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const defaultData = [
    { id: '1', name: 'Math', description: 'Algebra and Geometry', assignedTeacher: 'Mr. Smith' },
    { id: '2', name: 'Science', description: 'Physics and Chemistry', assignedTeacher: 'Mrs. Johnson' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the user role
        const storedRole = await AsyncStorage.getItem(constants.USER_ROLE);
        setUserRole(storedRole);

        // Fetch courses from AsyncStorage
        const storedCourses = await AsyncStorage.getItem(constants.COURSES);
        if (storedCourses) {
          setCourses(JSON.parse(storedCourses));
        } else {
          // If no courses are stored, use the default data
          setCourses(defaultData);
          saveCoursesToStorage(defaultData); // Save default courses to AsyncStorage
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Save courses to AsyncStorage
  const saveCoursesToStorage = async (courses) => {
    try {
      await AsyncStorage.setItem(constants.COURSES, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  };

  // Function to add a new course
  const addCourse = () => {
    if (!courseName || !courseDescription || !assignedTeacher) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newCourse = {
      id: Date.now().toString(),
      name: courseName,
      description: courseDescription,
      assignedTeacher,
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    saveCoursesToStorage(updatedCourses);

    setCourseName('');
    setCourseDescription('');
    setAssignedTeacher('');
    setModalVisible(false); // Close the modal
  };

  // Function to update a course
  const updateCourse = () => {
    const updatedCourses = courses.map(course =>
      course.id === editingCourseId
        ? { ...course, name: courseName, description: courseDescription, assignedTeacher }
        : course
    );
    setCourses(updatedCourses);
    saveCoursesToStorage(updatedCourses);

    setCourseName('');
    setCourseDescription('');
    setAssignedTeacher('');
    setModalVisible(false); // Close the modal
    setEditMode(false); // Reset edit mode
  };

  // Open modal for adding or editing course
  const openModal = (course = null) => {
    if (course) {
      setEditMode(true);
      setEditingCourseId(course.id);
      setCourseName(course.name);
      setCourseDescription(course.description);
      setAssignedTeacher(course.assignedTeacher);
    } else {
      setEditMode(false);
      setCourseName('');
      setCourseDescription('');
      setAssignedTeacher('');
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Course Details</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={styles.courseText}>{`Course: ${item.name}`}</Text>
            <Text>{`Description: ${item.description}`}</Text>
            <Text>{`Assigned Teacher: ${item.assignedTeacher}`}</Text>

            {userRole === 'Teacher' && (
              <View style={styles.editContainer}>
                <Button title="Edit" onPress={() => openModal(item)} />
              </View>
            )}
          </View>
        )}
      />

      {userRole === 'Teacher' && (
        <Button title="Add Course" onPress={() => openModal()} />
      )}

      {/* Modal for adding or editing course */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Course' : 'Add Course'}</Text>

            <TextInput
              placeholder="Course Name"
              value={courseName}
              onChangeText={setCourseName}
              style={styles.input}
            />
            <TextInput
              placeholder="Course Description"
              value={courseDescription}
              onChangeText={setCourseDescription}
              style={styles.input}
            />
            <TextInput
              placeholder="Assigned Teacher"
              value={assignedTeacher}
              onChangeText={setAssignedTeacher}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <ButtonCustom title="Cancel" onPress={() => setModalVisible(false)} />
              <ButtonCustom title={editMode ? 'Update' : 'Add'} onPress={editMode ? updateCourse : addCourse} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  courseItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  courseText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  editContainer: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width:'100%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width:'100%',
  },
});
