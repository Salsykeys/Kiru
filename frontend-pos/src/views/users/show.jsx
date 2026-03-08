import { Link, useParams } from 'react-router-dom';
import LayoutAdmin from '../../layouts/admin.jsx';
import { useState, useEffect } from 'react';
import Api from '../../service/api';

export default function UserShow() {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userRes, transRes] = await Promise.all([
                    Api.get(`/api/users/${id}`),
                    Api.get(`/api/users/${id}/transactions`)
                ]);
                setUserProfile(userRes.data.data);
                setTransactions(transRes.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Calculate total transactions and handled amount
    const calculateTotalHandled = () => {
        return transactions.reduce((acc, curr) => acc + curr.grand_total, 0);
    };

    // Currency Formatting (Indonesian Rupiah)
    const formatIDR = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Date formatting
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <LayoutAdmin>
            <div className="container-xl">
                {/* Welcome Section */}
                <div className="row align-items-center mb-4 g-3">
                    <div className="col">
                        <div className="page-pretitle text-secondary mb-1">PROFIL KASIR</div>
                        <h2 className="page-title h1 fw-bold">Profil {userProfile.name}</h2>
                    </div>
                </div>

                <div className="row row-cards">
                    {/* Stats Card */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card card-sm bg-primary text-primary-fg rounded shadow-sm border-0 transition-hover" style={{
                            background: 'linear-gradient(135deg, #0054a6 0%, #17a2b8 100%)',
                            cursor: 'default'
                        }}>
                            <div className="card-body p-4 text-center">
                                <div className="mb-2 opacity-75 fs-4 text-white">Total Omset Dilayani</div>
                                <div className="display-5 fw-bold mb-3 text-white">{formatIDR(calculateTotalHandled())}</div>
                                <div className="small bg-white bg-opacity-20 rounded p-2 px-3 d-inline-block text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-receipt me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2m4 -14h6m-6 4h6m-2 4h2" /></svg>
                                    Menangani {transactions.length} Transaksi
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info Card */}
                    <div className="col-md-6 col-lg-8">
                        <div className="card rounded shadow-sm border-0 h-100 overflow-hidden">
                            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                                <h3 className="card-title h3 fw-bold">Informasi Kasir</h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-sm-6">
                                        <div className="datagrid-title text-secondary small text-uppercase fw-bold mb-1">Nama Lengkap</div>
                                        <div className="datagrid-content fw-medium text-dark">{userProfile.name}</div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="datagrid-title text-secondary small text-uppercase fw-bold mb-1">Email</div>
                                        <div className="datagrid-content fw-medium text-dark">{userProfile.email}</div>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <div className="datagrid-title text-secondary small text-uppercase fw-bold mb-1">Bergabung Sejak</div>
                                        <div className="datagrid-content fw-medium text-dark">{userProfile.created_at ? formatDate(userProfile.created_at) : '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="col-12 mt-4">
                        <div className="card rounded shadow-sm border-0 overflow-hidden">
                            <div className="card-header bg-transparent py-3 px-4 d-flex align-items-center justify-content-between">
                                <h3 className="card-title h3 fw-bold m-0">Riwayat Transaksi Dilayani</h3>
                                <span className="badge bg-blue-lt px-3 rounded-pill p-2">{transactions.length} Transaksi</span>
                            </div>
                            <div className="table-responsive">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </div>
                                ) : (
                                    <table className="table table-vcenter table-nowrap card-table">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3">Nota</th>
                                                <th className="py-3">Tanggal</th>
                                                <th className="py-3">Item Scan</th>
                                                <th className="py-3">Grand Total</th>
                                                <th className="py-3 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.length > 0 ? (
                                                transactions.map((tn) => (
                                                    <tr key={tn.id}>
                                                        <td className="px-4 fw-bold text-primary">{tn.invoice}</td>
                                                        <td className="text-secondary">{formatDate(tn.created_at)}</td>
                                                        <td>
                                                            <span className="badge bg-secondary-lt rounded-pill">
                                                                {tn.transaction_details.length} Produk
                                                            </span>
                                                        </td>
                                                        <td className="fw-bold">{formatIDR(tn.grand_total)}</td>
                                                        <td className="text-center">
                                                            <span className="badge bg-success text-white px-2 rounded-2">Selesai</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5">
                                                        <div className="empty">
                                                            <div className="empty-img">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-receipt-off opacity-25" width="60" height="60" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 21v-16m2 -2h10a2 2 0 0 1 2 2v10m0 4.01v.99l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" /><path d="M11 7h4" /><path d="M7 10h1" /><path d="M14 10h1" /><path d="M7 14h3" /><path d="M3 3l18 18" /></svg>
                                                            </div>
                                                            <p className="empty-title text-muted mt-3">Belum ada transaksi</p>
                                                            <p className="empty-subtitle text-secondary">
                                                                Kasir ini belum pernah melayani transaksi.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
