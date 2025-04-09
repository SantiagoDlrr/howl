import React from 'react';
import Image from 'next/image';
import logo from 'howl/../public/images/logo.png';

const LogoElement = () => {
    return (
        <div className="flex flex-row items-center gap-1">
            <Image src={logo} alt={'Howl logo'} className='w-12' />
            <h1 className='font-medium text-lg'>
                HowlX
            </h1>
        </div>
    )
}

export default LogoElement;