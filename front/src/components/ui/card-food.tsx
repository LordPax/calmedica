import React from 'react';
import SaladeIcon from './svg-salad';

const CardFood: React.FC = () => {
  return (
    <>
        <div className="top-section">
            <SaladeIcon></SaladeIcon>
            <p>Salade</p>
        </div>
        <div className="middle-section">
            <h3 className="text-2xl font-bold sm:text-3xl custom-color-h1">Green Mixed Salad With Garlic</h3>
        </div>
        <div className="bottom-section">
            <img src="./front/public/images/salade.jpeg" alt="image salade" />
        </div>
    </>
  );
};

export default CardFood;
