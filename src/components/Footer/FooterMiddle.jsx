import React from 'react';
import FooterMiddlelist from './FooterMiddlelist';
import { middleList } from '../../constants';
import logo from "../../images/icon.svg";

const FooterMiddle = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="relative left-0 w-full bg-slate-700">
            <div className="bg-slate-700 hover:bg-slate-600 text-white h-10 flex justify-center">
                <button className="text-sm" onClick={scrollToTop}>
                    Back to top
                </button>
            </div>
            <div className="bg-amazon_light text-white">
                <div className="border-b border-gray-500">
                    <div className="max-w-5xl mx-auto px-4 py-10">
                        <div className="grid grid-cols-2 sml:grid-cols-3 lgl:grid-cols-4 gap-5">
                            {middleList.map((item) => (
                                <FooterMiddlelist key={item.id} title={item.title} listItem={item.listItem} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center py-6">
                    <img className="w-20 pt-3" alt="logo" src={logo} />
                    <div className="flex ml-4">
                        <p className="border border-gray-500 hover:border-amazon_yellow cursor-pointer px-2 py-1 text-sm">
                            English
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterMiddle;
