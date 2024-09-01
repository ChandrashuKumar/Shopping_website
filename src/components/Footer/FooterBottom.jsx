import React from 'react';
import { BottomList } from '../../constants';

const FooterBottom = () => {
    return (
        <div className='absolute left-0 w-full bg-footerBottom'>
            <div className='w-full px-10 border-b-[1px] border-gray-500'>
                <div className='max-w-5xl mx-auto text-gray-50'>
                    <div className='w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-start gap-4'>
                        {BottomList.map((item) => (
                            <div className='text-white hover:underline mt-4 text-center md:text-left' key={item.id}>
                                <p className='text-xs text-gray-200 font-semibold'>{item.title}</p>
                                <p className='text-xs text-gray-300 w-28 mx-auto md:mx-0'>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-evenly w-full md:w-80 mx-auto mt-5">
                        <span className="text-gray-300 text-xs font-medium hover:underline text-center">Conditions of use</span>
                        <span className="text-gray-300 text-xs font-medium hover:underline text-center">Privacy Notice</span>
                        <span className="text-gray-300 text-xs font-medium hover:underline text-center">Internet-Based Ads</span>
                    </div>
                    <div className="text-center text-xs mt-3 text-gray-300">
                        © 1996-2023, Neutron.com, Inc. or its affiliates
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterBottom;

