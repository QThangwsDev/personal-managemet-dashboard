import { todoAPI } from "../database/fakeDB";
import { useState,useEffect } from "react";
import WelcomeCard from "../components/WelcomeCard";
import { SquareCheckBig, Check, Zap, TrendingUp } from "lucide-react";


const Overview= () => {
    const [tasks, setTask] = useState([]);
    const[ bganimate,setBganimate] = useState(0);
    const [cir1,setCir1] = useState(0);
    const [cir2,setCir2] = useState(0);

    // goi du lieu vao state
    useEffect(()=> {
        const fetchdata = async () => {
            try {
                const result =  await todoAPI.getAll();
                //binh thuong se them data.json() nhung do dang lam db gia nen khoi
                setTask(result);
            } catch (err) {
                console.log(err);
            }
        };

        fetchdata();
    },[]);

    //cac bien lien quan
    const total =tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const remain =total-completed;
    const overoll = completed>0 ? Math.round(completed/total * 100) : 0 ;
    const worktasks = tasks.filter(task => task.category ==='work');
    const worktasksleght= worktasks.length;
    const workdone= worktasks.filter(work => work.isCompleted).length ;
    const personaltasks = tasks.filter(task => task.category ==='personal');
    const personaltasksleght = personaltasks.length;
    const personaldone= personaltasks.filter(personal => personal.isCompleted).length;

    // logic hinh tron
    const radius =25;
    const radiusmd = 80;
    const strokew =8;
    const strokeWmd =16;
    const circumference = 2* Math.PI * radius;
    const circumferencemd=  2* Math.PI * radiusmd;
    // phan tram hoan thanh 
    const percentWork = worktasksleght > 0 ? Math.round((workdone/worktasksleght) *100) : 0;
    const percentPersonal = personaltasksleght > 0 ? Math.round(personaldone/personaltasksleght * 100) : 0 ;
    const percentDone = completed >0 ? Math.round((completed/total) *100 ) :0;
    
    
    

    useEffect(() => {
        

        const bgtimer = setTimeout(() => {
            setBganimate(100);
        }, 100);

        const fulltimer= setTimeout(() => {
            setCir1(100);
            setCir2(100);
        }, 500);

        const settimer = setTimeout(() => {
            setCir1(percentWork);
            setCir2(percentPersonal);
        },900);

        return () => {
           
            clearTimeout(bgtimer);
            clearTimeout(fulltimer);
            clearTimeout(settimer);
        }
    },[tasks]);


    const bgdashoffset = circumference - (bganimate/100) * circumference;
    const cir1dashoffset = circumference - (cir1/100) * circumference;
    const cir2dashoffset = circumference - (cir2/100) * circumference;

    // dung cho man md tro len
    const bgdashoffsetmd = circumferencemd - (bganimate/100) * circumferencemd;
    const cir1dashoffsetmd = circumferencemd - (cir1/100) * circumferencemd;
    const cir2dashoffsetmd = circumferencemd - (cir2/100) * circumferencemd;
    return (
        <div className='w-full flex flex-col  text-2xl font-bold text-white mb-23'>
            {/* thong tin task */}

            {/* Layout tren mobile */}
            <div className='w-[90%]  mx-auto my-6 flex flex-col  space-y-3 md:hidden '>
                <WelcomeCard
                    percent={percentDone} />
                {/* cac thong tin lien quan */}
                <div className=' w-full grid grid-cols-2 gap-3 '>
                    <div className='h-25 flex-1 rounded-2xl  bg-[#584944] flex flex-col space-y-2 p-5'>
                        <span className='flex space-x-2 items-center'><SquareCheckBig /> <h2 className='text-sm font-serif'>TOTAL TASK</h2></span>
                        <span >{total}</span>
                    </div>

                    <div className='h-25 rounded-2xl  bg-[#584944] flex flex-col text-green-400  space-y-2 p-5'>
                        <span className='flex space-x-2 items-center'> <Check />  <h2 className='text-sm font-serif'>COMPLETED</h2></span>
                        
                        <span>{completed}</span>
                    </div>

                    <div className='h-25 rounded-2xl  bg-[#584944] flex flex-col text-yellow-300 space-y-3 p-5 '>
                        <span className='flex space-x-2 items-center'> <Zap />  <h2 className='text-sm font-serif'>REMAINING</h2></span>
                        <span>{remain}</span>
                    </div>

                    <div className=' h-25 rounded-2xl   bg-[#584944] flex flex-col text-blue-500 space-y-3 p-5'>
                         <span className='flex space-x-2 items-center'> <TrendingUp /> <h2 className='text-sm font-serif'>OVERALL</h2></span>
                        <span>{overoll}%</span>
                    </div>
                </div>
                {/* ca bang tieng trinh */}
                <div className='w-full flex justify-around space-x-3 '>
                     <div className="w-full h-50 bg-[#584944] rounded-2xl flex flex-col p-3 relative">
                    <span className="text-sm">WORK TASK</span>
                    <svg className="w-fulln transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                            cx='50' 
                            cy='50' 
                            r={radius}
                            fill='transparent'
                            className='stroke-white transition-all duration-500 ease-in'
                            strokeWidth={strokew}
                            strokeDasharray={circumference}
                            strokeDashoffset={bgdashoffset}
                            />
                        <circle
                            r={radius}
                            cx='50'
                            cy='50'
                            fill="transparent"
                            strokeWidth={strokew}
                            className="stroke-[#5792F6] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                            strokeDasharray={circumference}
                            strokeDashoffset={cir1dashoffset}
                            
                        />
                    </svg>
                    <span className='mx-auto text-xl '>{workdone} of {worktasksleght} done</span>
                    </div>

                    <div className="w-full h-50 bg-[#584944] rounded-2xl flex flex-col p-3 relative">
                    <span className="text-sm">PERSONALS TASK</span>
                    <svg className="w-fulln transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                            cx='50' 
                            cy='50' 
                            r={radius}
                            fill='transparent'
                            className='stroke-white transition-all duration-500 ease-in'
                            strokeWidth={strokew}
                            strokeDasharray={circumference}
                            strokeDashoffset={bgdashoffset}
                            />
                        <circle
                            r={radius}
                            cx='50'
                            cy='50'
                            fill="transparent"
                            strokeWidth={strokew}
                            className="stroke-[#5792F6] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                            strokeDasharray={circumference}
                            strokeDashoffset={cir2dashoffset}
                            
                        />
                    </svg>
                    <span className='mx-auto text-xl'>{personaldone} of {personaltasksleght} done</span>

                    </div>
                </div>
            </div>

            {/* Layout tren desktop */}
            <div className='hidden md:flex w-full h-full flex-col space-y-4 p-5'>
                <WelcomeCard
                    percent={percentDone}/>
                {/* Cac bang tong so Task */}
                <div className=' w-full md:grid grid-cols-4 gap-2 '>
                    <div className='h-25 flex-1 rounded-2xl  bg-[#584944] flex flex-col justify-center items-center space-y-2 p-2'>
                        <span className='flex space-x-2 items-center md: flex-wrap md:justify-center md:items-center md space-y-2'><SquareCheckBig /> <h2 className='text-sm font-serif'>TOTAL TASK</h2></span>
                        <span >{total}</span>
                    </div>

                    <div className='h-25 rounded-2xl  bg-[#584944] flex flex-col text-green-400 justify-center items-center space-y-2 p-2'>
                        <span className='flex space-x-2 items-center md: flex-wrap md:justify-center md:items-center md space-y-2 '> <Check />  <h2 className='text-sm font-serif'>COMPLETED</h2></span>
                        
                        <span>{completed}</span>
                    </div>

                    <div className='h-25 rounded-2xl  bg-[#584944] flex flex-col justify-center items-center text-yellow-300 space-y-3 p-5 '>
                        <span className='flex space-x-2 items-center  md: flex-wrap md:justify-center md:items-center md space-y-2 '> <Zap />  <h2 className='text-sm font-serif'>REMAINING</h2></span>
                        <span>{remain}</span>
                    </div>

                    <div className=' h-25 rounded-2xl   bg-[#584944] flex flex-col justify-center items-center text-blue-500 space-y-3 p-5'>
                         <span className='flex space-x-2 items-center md: flex-wrap md:justify-center md:items-center md space-y-2 '> <TrendingUp /> <h2 className='text-sm font-serif'>OVERALL</h2></span>
                        <span>{overoll}%</span>
                    </div>
                </div>
                {/*  Cac vong tien trinh */}
                <div className='w-full flex justify-around space-x-3 '>
                     <div className="w-full h-50 bg-[#584944] rounded-2xl flex flex-col p-3 relative">
                    <span>WORK TASK</span>
                    <svg className="w-full transform -rotate-90" viewBox="0 0 200 200">
                        <circle 
                            cx='100' 
                            cy='100' 
                            r={radiusmd}
                            fill='transparent'
                            className='stroke-white transition-all duration-500 ease-in'
                            strokeWidth={strokeWmd}
                            strokeDasharray={circumferencemd}
                            strokeDashoffset={bgdashoffsetmd}
                            />
                        <circle
                            r={radiusmd}
                            cx='100'
                            cy='100'
                            fill="transparent"
                            strokeWidth={strokeWmd}
                            className="stroke-[#e95b2c] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                            strokeDasharray={circumferencemd}
                            strokeDashoffset={cir1dashoffsetmd}
                            
                        />
                    </svg>
                    <span className='mx-auto'>{workdone} of {worktasksleght} </span>
                    </div>

                    <div className="w-full h-50 bg-[#584944] rounded-2xl flex flex-col p-3 relative">
                    <span>PERSONALS TASK</span>
                    <svg className="w-fulln transform -rotate-90" viewBox="0 0 200 200">
                        <circle 
                            cx='100' 
                            cy='100' 
                            r={radiusmd}
                            fill='transparent'
                            className='stroke-white transition-all duration-500 ease-in'
                            strokeWidth={strokeWmd}
                            strokeDasharray={circumferencemd}
                            strokeDashoffset={bgdashoffsetmd}
                            />
                        <circle
                            r={radiusmd}
                            cx='100'
                            cy='100'
                            fill="transparent"
                            strokeWidth={strokeWmd}
                            className="stroke-[#f3830c] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                            strokeDasharray={circumferencemd}
                            strokeDashoffset={cir2dashoffsetmd}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className='mx-auto'>{personaldone} of {personaltasksleght} done</span>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview;