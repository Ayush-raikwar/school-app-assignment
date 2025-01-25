import { NavigationContainer } from "@react-navigation/native"
import {TimetableScreen} from '../screens/TimetableScreen'
import {ManageTimetableScreen} from '../screens/ManageTimetableScreen'
import {CourseDetailsScreen} from '../screens/CourseDetailsScreen'
import {ChatScreen} from '../screens/ChatScreen'
import { createStackNavigator } from "@react-navigation/stack"
import { constants } from "../constants"
import { AiChatScreen } from "../screens/AiChatScreen"

export const Routes = () => {
    const Stack = createStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={constants.screens.TIME_TABLE}>
                <Stack.Screen name={constants.screens.TIME_TABLE} component={TimetableScreen} />
                <Stack.Screen name={constants.screens.MANAGE_TIMETABLE} component={ManageTimetableScreen} />
                <Stack.Screen name={constants.screens.COURSE_DETAILS} component={CourseDetailsScreen} />
                <Stack.Screen name={constants.screens.AI_CHAT} component={AiChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}