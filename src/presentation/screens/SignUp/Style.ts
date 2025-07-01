import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '../../../constants/colors';
import { Dimens } from '../../../constants/dimens';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
      },
      card: {
        width: '100%',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: {
          width: 0,
          height: 5,
        },
        bottom:hp("10%"),
      },
      title: {
        fontSize: Dimens.fontSize.FONTSIZE_24,
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
        // marginBottom: 20,
      },
      input: {
        // height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 25,
        fontSize: 16,
        color: '#000',
        paddingHorizontal: 10,
      },
      signInButton: {
        backgroundColor: '#397ef6',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
      },
      signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      },
      forgotPassword: {
        color: '#397ef6',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 15,
      },
      signUpContainer: {
        alignItems: 'center',
        // marginTop: 20,
        position: 'absolute',
        top:hp("95%"),
        alignSelf:'center'
      },
      signUpText: {
        fontSize: 14,
        color: '#555',
      },
      signUpLink: {
        color: '#007bff',
        fontWeight: '600',
        textDecorationLine: 'underline',
    top:hp("0.5%")
      },
});
