# school-app-assignment
This repo is regarding an assignment on School timetable management app.

Packages/libraries used - 
- @react-native-async-storage/async-storage
- axios
- expo
- lottie-react-native
- react-native-date-picker
- react-native-dotenv

  

Home page / Timetable screen ---> <img width="409" alt="1" src="https://github.com/user-attachments/assets/a505f9b9-1e68-4eae-b543-e435538c448d" />
1) Home screen is pretty straightforward. User will be prompted to select if he/she is a Teacher or Student.
   CHANGE ROLES button -> Button to change roles from Teacher/Student.

   **Role - Student** -
   2) Once user selects "Student", Student home page will be shown ---> <img width="411" alt="student home" src="https://github.com/user-attachments/assets/bd4e5284-402f-4888-b828-9374fc387944" />
   
     A student can only view Time tables in a list.
     3) Student can also View Courses by presssing COURSES button.
     4) Courses screen (Student View) ---> <img width="410" alt="student courses" src="https://github.com/user-attachments/assets/f3f31922-c593-4a3d-8cde-04e40655be55" />
     
        Similar to Timetable screen, a Student is confined to only View the Courses.

  **Role - Teacher** - 

  5) If user Selects "I AM A TEACHER", then a TextInput field will popup, asking for Passcode. ---> <img width="409" alt="teacher prompt" src="https://github.com/user-attachments/assets/d1239fd1-0d89-4a13-9165-214bbf5250ab" />
  
  
     **IMPORTANT - Please Enter "1234" as passcode**
     
  7) Teacher's Home screen ---> 
     Teachers home screen is almost same as Student's but there is an additional button "MANAGE TIMETABLE".
  
  8) MANAGE TIMETABLE button takes us to another screen, where a Teacher can ADD or DELETE a timetable entry. ---> <img width="407" alt="mange timetable" src="https://github.com/user-attachments/assets/54416483-0c30-4cc5-8a73-e6aee15f0a2e" />


  9) Teacher should enter a Subject, pick a Date & Timeslot for the timetable. ---> <img width="406" alt="date n time select" src="https://github.com/user-attachments/assets/802bde3b-9127-4a84-9296-903a27d937cd" />


  10) Teacher's Course Screen ---> <img width="409" alt="teacher course scren" src="https://github.com/user-attachments/assets/bcb87bc9-a10b-4496-ac59-bc9bf68e89e0" />


  11) A Teacher can ADD/UPDATE a course ---> <img width="410" alt="teacher course edit" src="https://github.com/user-attachments/assets/a05a6601-6fb7-4bd3-be7a-ab36ce57677e" />


  **GEMINI API **

  12) Any user (Student/Teacher) can access the Gemini AI chat, by clicking on **Ask GEMINI** button .
  
  13) Gemini Homepage is straightforward as well. ----> <img width="399" alt="gemini home" src="https://github.com/user-attachments/assets/069f8763-2cc9-47a5-9580-1adf84a926bc" />

  14) Gemini Response ---> <img width="409" alt="gemini response" src="https://github.com/user-attachments/assets/3b19adce-8ce4-4899-8847-c7db33569a20" />

  **NOTE** - To persist the data, Async storage is used, even if user kills the app, data will persist
