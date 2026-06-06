import mylogo from '../assets/react.svg'

export default function Logo ({collapse}){

    return(
        <div className="w-full flex justify-around border-b border-gray-700 space-x-3 pb-3">
            <img
                src={mylogo}
                alt='logo'/>
            {!collapse && (<span>Sophia</span>)}
        </div>
    )
}