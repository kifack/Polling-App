import React from "react";

import UI_ELEMENT from "../../assets/images/ui-element.png";
import CARD_1 from "../../assets/images/auth-card-1.png";
import CARD_2 from "../../assets/images/auth-card-2.png";
import CARD_3 from "../../assets/images/auth-card-3.png";

const AuthLayout = ({ children }) => {
  return (
    <div className='flex '>
      <div className='w-screen h-screen md:w-1/2 pt-3  px-8 '>
        <h2 className=' font-bold text-2xl text-primary p-2'>Polling App</h2>
        {children}
      </div>
      <div
        className='hidden md:block w-1/2 h-screen bg-auth bg-sky-50
         bg-cover bg-no-repeat bg-center overflow-hidden
      relative'
      >
        <img src={UI_ELEMENT} className='w-[50%] absolute right-0 top-10' />
        <img
          src={UI_ELEMENT}
          className='w-[55%] absolute rotate-180 left-0 -bottom-[15%]'
        />
        <img
          src={CARD_1}
          className='w-64 lg:w-72 absolute top-[8%] left-[10%] shadow-lg shadow-blue-400/15'
        />
        <img
          src={CARD_2}
          className='w-64 lg:w-72 absolute top-[34%] left-[50%] shadow-lg shadow-blue-400/15'
        />
        <img
          src={CARD_3}
          className='w-64 lg:w-72 absolute top-[70%] left-[10%] shadow-lg shadow-blue-400/15'
        />
      </div>
    </div>
  );
};

export default AuthLayout;
