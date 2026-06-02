import {GoogleOutlined, GithubOutlined, FacebookOutlined} from '@ant-design/icons';
import { useState } from 'react';

const LoginForm = () => {

    const [inputName, setInputName] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    return (
        <div className='w-full min-h-screen bg-linear-to-br from-slate-800 via-indigo-850 via-slate-800 to-emerald-950 flex flex-col items-center justify-center'>
            {/* O hien loi chao nay kia */}
            <div className='w-full max-w-md bg-linear-to-b from-blue-800 via-blue-800 to-violet-100 rounded-t-2xl p-8 text-sm space-y-6 font-bold text-white'>
                <h2 className='text-3xl font-bold text-center'>Welcome Back</h2>
                <p className='text-center text-sm font-serif'>Please login to your account</p>
            </div>


           {/* Form đăng nhập */} 
            <div className='w-full max-w-md max-h-[80%]  flex flex-col justify-center items-center bg-white opacity-90 rounded-b-2xl p-8 text-sm space-y-6 font-bold text-gray-800'>
                <h2 className='text-2xl'>Login</h2>
                {/* Form đăng nhập */}
                <form className='w-full flex flex-col space-y-4'>
                    <input 
                        type="text" 
                        placeholder='Username' 
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder='Password' 
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                    />
                    <div className='flex items-center ml-1'>
                        <input type="checkbox" id="remember" className='mr-2' />
                        <label htmlFor="remember" className='text-sm font-serif'>Remember me</label>
                    </div>
                    <button type='submit' className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300'>Login</button>
                </form>
                <p className='text-center text-sm font-serif'>Don't have an account? <a href="#" className='text-blue-600 hover:underline'>Sign Up</a></p>

                {/* Dang nhap bang nhung tai khoan khac */}
                <div className='w-full flex items-center justify-center space-x-4'>
                    <button className='flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300'>
                        <GoogleOutlined />
                        <span>Google</span>
                    </button>
                    <button className='flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300'>
                        <GithubOutlined />
                        <span>GitHub</span>
                    </button>
                    <button className='flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300'>
                        <FacebookOutlined />
                        <span>Facebook</span>
                    </button>
                </div>
            </div>
        </div>
    )
}


export default LoginForm