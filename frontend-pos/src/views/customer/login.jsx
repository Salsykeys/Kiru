import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useCustomerStore } from '../../stores/customer';
import { handleErrors } from "../../utils/handleErrors";
import LayoutAuth from '../../layouts/auth';
import toast from 'react-hot-toast';

export default function CustomerLogin() {
    const navigate = useNavigate();
    const { customerLogin } = useCustomerStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loginFailed, setLoginFailed] = useState('');

    const loginHandler = async (e) => {
        e.preventDefault();
        await customerLogin({ email, password })
            .then(() => {
                toast.success("Login Berhasil!");
                navigate('/customer');
            })
            .catch((error) => {
                if (error.response?.data?.message) {
                    setLoginFailed(error.response.data.message);
                } else {
                    handleErrors(error.response?.data, setErrors);
                }
            });
    };

    return (
        <LayoutAuth>
            <div className="text-center mb-4 mt-5">
                <Link to="/" className="navbar-brand navbar-brand-autodark p-4 bg-blue-lt rounded-circle shadow-sm">
                    <img src="/images/man.png" height="60" alt="Geraiku" />
                </Link>
                <h2 className='mt-3'>LOGIN CUSTOMER</h2>
            </div>
            <div className="card card-md rounded border-0 shadow-sm">
                <div className="card-body">
                    {/* <h2 className="h2 text-center mb-4">Masuk ke Akun Anda</h2> */}
                    {loginFailed && <div className="alert alert-danger">{loginFailed}</div>}
                    <form onSubmit={loginHandler} autoComplete="off">
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                            {errors.email && <div className="text-danger mt-1 small">{errors.email}</div>}
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
                            {errors.password && <div className="text-danger mt-1 small">{errors.password}</div>}
                        </div>
                        <div className="form-footer">
                            <button type="submit" className="btn btn-primary w-100 rounded">Sign in</button>
                        </div>
                    </form>
                    <hr className="my-4" />
                    <div className="text-center">
                        <Link to="/login/staff" className="btn btn-outline-secondary w-100 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-shield me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 21v-2a4 4 0 0 1 4 -4h2" /><path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /></svg>
                            Login sebagai Kasir
                        </Link>
                    </div>
                </div>
            </div>
            <div className="text-center text-muted mt-3">
                Belum punya akun? <Link to="/customer/register">Daftar sekarang</Link>
            </div>
        </LayoutAuth>
    );
}
