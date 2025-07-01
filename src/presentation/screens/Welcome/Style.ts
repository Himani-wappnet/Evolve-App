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
        backgroundColor: '#f2f4f7',
      },
      backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '90%',
        opacity: 0.8, // Optional for soft look
      },
      imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        justifyContent: 'center',
      },
      gridImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        margin: 6,
      },
      bottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
      },
      content: {
        alignItems: 'center',
        padding: 20,
        bottom:hp('8%'),
      },
      title: {
        fontSize: Dimens.fontSize.FONTSIZE_20,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 8,
      },
      subtitle: {
        fontSize: Dimens.fontSize.FONTSIZE_14,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
      },
      emailBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
      },
      emailBtnText: {
        color: '#fff',
        fontWeight: '600',
      },
      socialBtn: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      socialBtnText: {
        color: '#000',
        fontWeight: '500',
      },
      socialBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      socialLogo: {
        width: 20,
        height: 20,
        marginRight: 10,
      },
      signInText: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
      },
      signInLink: {
        color: Colors.primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
      },
});
