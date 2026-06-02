import {Button , Form, Input} from 'antd';
import { GoogleOutlined, GithubOutlined, FacebookOutlined } from '@ant-design/icons';


const RegisterForm = () => {

  return (
    <div className='w-full min-h-screen bg-linear-to-br from-slate-800 via-indigo-850 via-slate-800 to-emerald-950 flex flex-col items-center justify-center'>
        <div className='w-full max-w-md bg-linear-to-b from-blue-800 via-blue-800 to-violet-100 rounded-t-2xl p-8 text-sm space-y-6 font-bold text-white'>
            <h2 className='text-3xl font-bold text-center'>Create Account</h2>
            <p className='text-center text-sm font-serif'>Please fill in the form to create an account</p>
        </div>

        {/* Form đăng ký */}
        <div className='w-full max-w-md max-h-[80%]  flex flex-col justify-center items-center bg-white   px-8 text-sm space-y-6 font-bold text-gray-800'>
            <h2 className='text-2xl'>Sign up</h2>
            <Form className='w-full flex flex-col space-y-4'>
                <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input placeholder='Username' className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
                    <Input placeholder='Email' className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password placeholder='Password' className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </Form.Item>
                <Form.Item name="confirm" dependencies={['password']} rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords do not match!')); }, }), ]}>
                    <Input.Password placeholder='Confirm Password' className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </Form.Item>
                
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300'>
                        Sign up
                    </Button>
                </Form.Item>
             </Form>   
        </div>
            {/* Dang ky bang nhung tai khoan khac */}
        <div className='w-full max-w-md flex justify-center space-x-4 bg-white rounded-b-md pb-2' >
            <Button className='flex items-center space-x-2 px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-100 transition duration-300'>
                <GoogleOutlined />
                <span>Google</span>
            </Button>
            <Button className='flex items-center space-x-2 px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-100 transition duration-300'>
                <GithubOutlined />
                <span>GitHub</span>
            </Button>
            <Button className='flex items-center space-x-2 px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-100 transition duration-300'>
                <FacebookOutlined />
                <span>Facebook</span>
            </Button>
        </div>

    </div>


  );
        

}

export default RegisterForm;