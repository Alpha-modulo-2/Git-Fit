import { styled } from '../../../stitches.config.ts';

export const Button = styled('button', {
  textAlign: 'center',
  color: '#fff',
  cursor: 'pointer',
  alignSelf: 'center',

  variants: {
    category: {
      primary: {
        backgroundColor: '#7353BA',
        borderRadius: '12px',
        border: 'none',
        padding: '10px 24px',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: '0.11em',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#845cda',
        },
        '@bp1': {
          padding: '7px 28px',
        },
      },
      secondary: {
        backgroundColor: '#7353BA',
        borderRadius: '25px',
        border: 'none',
        padding: '15px 34px',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: '0.11em',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#845cda',
        },
        '@bp1': {
          padding: '15px 40px',
        },
      },
      tertiary: {
        backgroundColor: '#A62626',
        borderRadius: '22px',
        border: 'none',
        padding: '8px 15px',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.11em',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#c93030',
        },
        '@bp1': {
          padding: '6px 15px',
        },
      },
    },
  },
});
