import mylogo from '../assets/react.svg'

export default function Logo (){

    return(
        <div className="flex justify-around space-x-3">
            <img
                src={mylogo}
                alt='logo'/>
            <span>Sophia</span>
        </div>
    )
}