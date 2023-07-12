import { MouseEventHandler } from 'react';
import * as S from './styles';

interface PropTypes {
  category: 'primary' | 'secondary' | 'tertiary';
  label: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
}

export const Button = ({
  category,
  label,
  onClick,
  disabled,
}: PropTypes) => {
  return (
    <S.Button
      onClick={onClick}
      disabled={disabled}
      category={category}
      className="btn"
    >
      {label}
    </S.Button>
  );
};
