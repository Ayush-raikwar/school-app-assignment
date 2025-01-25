import { StyleSheet, Text } from "react-native"

export const Title = ({text, style})=> {
    return(
        <Text style={[styles.textStyles,style]}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    textStyles: {
        fontSize:18,
        fontWeight:'600',
        color:'rgba(0,0,0,.5)',
        marginVertical:12
    }
})