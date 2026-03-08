import { Link } from 'react-router-dom';
import { useCustomerStore } from '../../stores/customer';
import { useState, useEffect, useCallback } from 'react';
import PaginationComponent from '../../components/Pagination';

export default function CustomerProfile() {
    const { customer, customerToken, getCustomerTransactions } = useCustomerStore();
    const [transactions, setTransactions] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 5,
        total: 0
    });

    const fetchTransactions = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await getCustomerTransactions(pageNumber);
            setTransactions(response.data);
            setTotalSpent(response.total_spent || 0);
            setPagination({
                currentPage: response.pagination.currentPage,
                perPage: response.pagination.perPage,
                total: response.pagination.total
            });
        } catch (error) {
            console.error("Fetch transactions error:", error);
        } finally {
            setLoading(false);
        }
    }, [getCustomerTransactions]);

    useEffect(() => {
        // Force scroll to top when page loaded
        window.scrollTo(0, 0);

        // Fix for stuck body scroll from modals/offcanvas
        document.body.style.overflow = 'auto';
        document.body.classList.remove('modal-open');
        document.body.classList.remove('offcanvas-open');
        const backdrops = document.querySelectorAll('.modal-backdrop, .offcanvas-backdrop');
        backdrops.forEach(b => b.remove());

        if (!customerToken || !customer.id) {
            return;
        }

        fetchTransactions(1);
    }, [customerToken, customer?.id, fetchTransactions]);

    // Point calculations (1 point for every 1000 grand total)
    const calculatePoints = () => {
        return Math.floor(totalSpent / 1000);
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

    const getStatusBadge = (status) => {
        if (status === 'success') return <span className="badge bg-success text-white px-2 rounded-2">Selesai</span>;
        if (status === 'pending') return <span className="badge bg-warning text-dark px-2 rounded-2">Menunggu Pembayaran</span>;
        if (status === 'failed') return <span className="badge bg-danger text-white px-2 rounded-2">Gagal</span>;
        return <span className="badge bg-secondary text-white px-2 rounded-2">{status}</span>;
    };

    return (
        <div className="page pb-5">
            {/* Header / Navbar */}
            <header className="navbar navbar-expand-md navbar-light d-print-none bg-white border-bottom shadow-sm py-3">
                <div className="container-xl">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <h1 className="navbar-brand navbar-brand-autodark d-none-xs me-md-3">
                        <Link to="/customer" className="d-flex align-items-center text-decoration-none text-primary">
                            <img src="/images/logo-kirudoang.png" height="40" alt="Kiru" className="me-2" />
                            <span className="h1 fw-bold  mb-0">Kiru</span>
                        </Link>
                    </h1>
                    <div className="navbar-nav flex-row order-md-last align-items-center gap-3">
                        <div className="nav-item">
                            <Link to="/customer" className="btn btn-outline-primary rounded-pill px-4 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-shopping-cart me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                                Kembali Belanja
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="page-wrapper pt-4">
                <div className="container-xl">
                    {/* Welcome Section */}
                    <div className="row align-items-center mb-4 g-3">
                        <div className="col">
                            <div className="page-pretitle text-secondary mb-1">PROFIL CUSTOMER</div>
                            <h2 className="page-title h1 fw-bold">Profil {customer.name}</h2>
                        </div>
                    </div>

                    <div className="row row-cards">
                        {/* Points Card */}
                        <div className="col-md-6 col-lg-4">
                            <div className="card card-sm bg-primary text-primary-fg rounded shadow-sm border-0 transition-hover" style={{
                                background: 'linear-gradient(135deg, #0054a6 0%, #17a2b8 100%)',
                                cursor: 'default'
                            }}>
                                <div className="card-body p-4 text-center">
                                    <div className="mb-2 opacity-75 fs-4 text-white">K-Points Anda</div>
                                    <div className="display-4 fw-bold mb-3 text-white">{calculatePoints().toLocaleString()} Poin</div>
                                    <div className="small bg-white bg-opacity-20 rounded p-2 px-3 d-inline-block text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-gift me-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" /><path d="M12 8l0 4" /><path d="M12 12l-4 0" /><path d="M12 12l4 0" /><path d="M12 7l0 1" /><path d="M7 16.5c.667 .333 1.333 .5 2 .5c2 0 3 -1 3 -3c0 -3 -1 -3 -3 -3c-2 0 -3 1 -3 3c0 2 1 3 3 3z" /><path d="M17 16.5c.667 .333 1.333 .5 2 .5c2 0 3 -1 3 -3c0 -3 -1 -3 -3 -3c-2 0 -3 1 -3 3c0 2 1 3 3 3z" /></svg>
                                        Gunakan poin untuk diskon belanja!
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info Card */}
                        <div className="col-md-6 col-lg-8">
                            <div className="card rounded shadow-sm border-0 h-100 overflow-hidden">
                                <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                                    <h3 className="card-title h3 fw-bold">Informasi Akun</h3>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-4">
                                        <div className="col-sm-6">
                                            <div className="datagrid-title text-secondary small text-uppercase fw-bold mb-1">Email</div>
                                            <div className="datagrid-content fw-medium text-dark">{customer.email}</div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="datagrid-title text-secondary small text-uppercase fw-bold mb-1">Nomor Telepon</div>
                                            <div className="datagrid-content fw-medium text-dark">{customer.no_telp || '-'}</div>
                                        </div>
                                        <div className="col-12">
                                            <div className="datagrid-title text-secondary small text-uppercase fw-bold mb-1">Alamat</div>
                                            <div className="datagrid-content fw-medium text-dark">{customer.address || 'Belum diatur'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="col-12 mt-4">
                            <div className="card rounded shadow-sm border-0 overflow-hidden">
                                <div className="card-header bg-transparent py-3 px-4 d-flex align-items-center justify-content-between">
                                    <h3 className="card-title h3 fw-bold m-0">Riwayat Transaksi</h3>
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
                                                                {getStatusBadge(tn.status)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-5">
                                                            <div className="empty">
                                                                <div className="empty-img">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-receipt-off opacity-25" width="60" height="60" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 21v-16m2 -2h10a2 2 0 0 1 2 2v10m0 4.01v.99l-3 -2l-2 2l-2 -2l-2 -2l-2 -2l-3 2" /><path d="M11 7h4" /><path d="M7 10h1" /><path d="M14 10h1" /><path d="M7 14h3" /><path d="M3 3l18 18" /></svg>
                                                                </div>
                                                                <p className="empty-title text-muted mt-3">Belum ada transaksi</p>
                                                                <p className="empty-subtitle text-secondary">
                                                                    Belanja di Kiru dan kumpulkan poin setiap hari!
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                {transactions.length > 0 && (
                                    <div className="card-footer bg-transparent p-3 text-center">
                                        <PaginationComponent
                                            currentPage={pagination.currentPage}
                                            perPage={pagination.perPage}
                                            total={pagination.total}
                                            onChange={(pageNumber) => fetchTransactions(pageNumber)}
                                            position="center"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-transparent d-print-none mt-5">
                <div className="container-xl">
                    <div className="row text-center align-items-center flex-row-reverse">
                        <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                            <ul className="list-inline list-inline-dots mb-0">
                                <li className="list-inline-item">
                                    Copyright &copy; 2026
                                    <Link to="/" className="link-secondary ms-1">Kiru</Link>.
                                    All rights reserved.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
