


import { useState } from 'react';

const WelcomeCard = ({percent,remaintask}) => {
    
    const remain = remaintask;
    
    const [today] = useState(() => new Date());

    const date = today.getDate();
    const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    // getMonth() trả về từ 0 đến 11, khớp hoàn hảo với index của mảng!
    const monthInWord = monthNames[today.getMonth()];
    const year = today.getFullYear();   // Lấy năm đầy đủ (Ví dụ: 2026)


    return (
        <div className="w-full h-50 bg-linear-to-bl flex flex-col from-[#6B5F5C] via-[#44312D] via-[#71534c] to-[#4d443f] rounded-2xl  ">
            {/* Loi chao va Avartar nguoi dung */}
            <div className="w-full flex justify-between px-3 py-5 space-x-10">
                {/* Thong tin ngay thang va loi chao */}
                <div>
                    <p className='text-sm text-[#c2a6a0]'> {monthInWord}  {date}, {year}</p>
                    <h2>Good moring,</h2>
                    <h3>Mir</h3>
                    <p className='text-sm text-[#c2a6a0]'>You have {remain} tasks left today</p>
                </div>
                {/* Avatar or hinh anh chup gan nhat */}
                <div>
                    <svg className='w-25 h-25 '  viewBox="0 0 200 200">
                        <circle 
                            cy='100'
                            cx='100'
                            r='80'
                            />
                    </svg>
                </div>
            </div>

            {/* thanh tieng trinh trong ngay */}

            <div className="mx-4">
                <p className='text-sm text-[#c2a6a0]'>Today's progress</p>
                {/* thanh tieng trinh */}
                <svg className='w-full '>
                    <rect 
                        x="0" 
                        y="0" 
                        width="100%" 
                        height="12" 
                        rx="6" 
                        className="fill-gray-200" 
                        />
                        
                        <rect 
                        x="0" 
                        y="0" 
                        width={`${percent}%`} 
                        height="12" 
                        rx="6" 
                        className="fill-[#a75e4d] transition-all duration-500 ease-out"
                        />
                </svg>
            </div>

        </div>
    )



}
export default WelcomeCard;