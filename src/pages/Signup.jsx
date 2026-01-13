import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const result = await signup(data);
        if (result.success) {
            navigate('/stores');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 20, message: 'Minimum 20 characters' },
                                maxLength: { value: 60, message: 'Maximum 60 characters' }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                        <textarea
                            {...register('address', { 
                                required: 'Address is required',
                                maxLength: { value: 400, message: 'Max 400 characters' } 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: '8-16 chars, 1 uppercase, 1 special char' },
                                maxLength: { value: 16, message: '8-16 chars, 1 uppercase, 1 special char' },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])/,
                                    message: "8-16 chars, 1 uppercase, 1 special char"
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
