import { StyleSheet, Text, TouchableOpacity } from "react-native"

export const ButtonCustom = ({
    onPress,
    title,
    id,
    style
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, { style }]}
            onPress={onPress}>
            <Text style={styles.btnTxt}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(10, 137, 255, 0.9)',
        padding: 12,
        borderRadius: 4,
        alignItems:'center',
        marginVertical:12
    },
    btnTxt: {
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: '600',
    }
})
