import { StyleSheet, Text, TouchableOpacity } from "react-native"

export const ButtonCustom = ({
    onPress,
    title,
    id,
    style,
    dropdownBtn
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, { style },dropdownBtn&&styles.dropdownStyles]}
            onPress={onPress}>
            <Text style={[styles.btnTxt,dropdownBtn&&{color:'#000'}]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(10, 137, 255, 0.9)',
        padding: 12,
        borderRadius: 4,
        alignItems:'center',
        marginVertical:12,
        width:'100%'
    },
    btnTxt: {
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    dropdownStyles: {
        borderWidth:1,
        borderRadius:4,
        borderColor:'rgba(0,0,0,.4)',
        backgroundColor:'#fff',
    }
})
