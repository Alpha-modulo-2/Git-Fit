// import React from 'react';
import { MouseEventHandler } from 'react';
// import data from '../../data.json';
import "./styles.css"

interface PropTypes {
  week_number: number;
  onClick?: MouseEventHandler;
}

const weekDays = [
  { id: 0, name: 'D' },
  { id: 1, name: 'S' },
  { id: 2, name: 'T' },
  { id: 3, name: 'Q' },
  { id: 4, name: 'Q' },
  { id: 5, name: 'S' },
  { id: 6, name: 'S' },
];

export const MiniCard = ({ week_number, onClick }: PropTypes) => {
  return (
    <div className="structure-minicard" onClick={onClick}>
        <h2>{weekDays[week_number].name}</h2>
    </div>
  );
};
