import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useCustomerStore } from '../../stores/customer';
import { handleErrors } from "../../utils/handleErrors";
import LayoutAuth from '../../layouts/auth';
import toast from 'react-hot-toast';

export default function CustomerRegister() {
    const navigate = useNavigate();
    const { customerRegister } = useCustomerStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [no_telp, setNoTelp] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({});

    const registerHandler = async (e) => {
        e.preventDefault();
        await customerRegister({ name, email, password, no_telp, address })
            .then(() => {
                toast.success("Registrasi Berhasil! Silahkan Login.");
                navigate('/login');
            })
            .catch((error) => {
                if (error.response?.data?.meta?.message) {
                    toast.error(error.response.data.meta.message);
                }
                handleErrors(error.response?.data, setErrors);
            });
    };

    return (
        <LayoutAuth>
            <div className="text-center mb-4 mt-5">
                <Link to="/" className="navbar-brand navbar-brand-autodark p-4 bg-blue-lt rounded-circle shadow-sm">
                    <img src="/images/man.png" height="60" alt="Geraiku" />
                </Link>
                <h2 className='mt-3'>DAFTAR AKUN CUSTOMER</h2>
            </div>
            <div className="card card-md rounded">
                <div className="card-body">
                    <form onSubmit={registerHandler} autoComplete="off">
                        <div className="mb-3">
                            <label className="form-label">Nama Lengkap</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan Nama Lengkap" />
                            {errors.name && <div className="text-danger mt-1 small">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Alamat Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                            {errors.email && <div className="text-danger mt-1 small">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 Karakter" />
                            {errors.password && <div className="text-danger mt-1 small">{errors.password}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">No. Telepon</label>
                            <input type="text" className="form-control" value={no_telp} onChange={(e) => setNoTelp(e.target.value)} placeholder="Contoh: 08123456789" />
                            {errors.no_telp && <div className="text-danger mt-1 small">{errors.no_telp}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Alamat</label>
                            <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Masukkan Alamat Lengkap"></textarea>
                            {errors.address && <div className="text-danger mt-1 small">{errors.address}</div>}
                        </div>
                        <div className="form-footer">
                            <button type="submit" className="btn btn-primary w-100 rounded">Daftar Sekarang</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="text-center text-muted mt-3">
                Sudah punya akun? <Link to="/login">Masuk disini</Link>
            </div>
        </LayoutAuth>
    );
}
