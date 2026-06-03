import mylogo from '../assets/react.svg'

export default function Logo (){

    return(
        <div className="w-full flex justify-around border-b space-x-3 pb-3">
            <img
                src={mylogo}
                alt='logo'/>
            <span>Sophia</span>
        </div>
    )
}