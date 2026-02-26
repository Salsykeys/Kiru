import { useState, useEffect } from 'react';
import LayoutAdmin from "../../layouts/admin";
import Cookies from 'js-cookie';
import Api from '../../service/api';
import PaginationComponent from '../../components/Pagination';
import CustomerCreate from './create';
import CustomerEdit from './edit';
import DeleteButton from '../../components/DeleteButton';

export default function CustomersIndex() {

    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 0,
        total: 0
    });

    const [keywords, setKeywords] = useState ("");

    const fetchData = async (pageNumber, keywords = "") => {

        const page = pageNumber ? pageNumber : pagination.currentPage;

        const token = Cookies.get('token');

        if (token) {
            Api.defaults.headers.common['Authorization'] = token;

            try {
               const response = await Api.get(`/api/customers?page=${page}&search=${keywords}`);
               
               setCustomers(response.data.data);

               setPagination (() => ({
                currentPage: response.data.pagination.currentPage,
                perPage: response.data.pagination.perPage,
                total: response.data.pagination.total
               }));

            } catch (error) {
                console.error("there was an error fetching the data!", error);
            }
        } else {
            console.error("Token is not available");
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const searchHandler = () => {
        fetchData(1, keywords)
    }

    const handleKeyDown = (e) => {
        if (e.key == 'Enter') {
            searchHandler();
        }
    };
 
    return (
        <LayoutAdmin>
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">
                                HALAMAN
                            </div>
                            <h2 className="page-title">
                                CUSTOMERS
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className='col-12 mb-3'>
                            <div className="input-group">
                            <CustomerCreate fetchData={fetchData} />
                                <input type="text" className="form-control" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={handleKeyDown} placeholder="search by customer name" />
                                <button onClick={searchHandler} className="btn btn-md btn-primary">SEARCH</button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-vcenter table-mobile-md card-table">
                                        <thead>
                                            <tr>
                                                <th>Customer Name</th>
                                                <th>No. Telp</th>
                                                <th>Address</th>
                                                <th className="w-1">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                customers.length > 0
                                                    ? customers.map((customer, index) => (
                                                        <tr key={index}>
                                                            <td data-label="Customer Name">
                                                                {customer.name}
                                                            </td>
                                                            <td className="text-muted" data-label="No. Telp">
                                                                {customer.no_telp}
                                                            </td>
                                                            <td className="text-muted" data-label="Address">
                                                                {customer.address}
                                                            </td>
                                                            <td>
                                                                <div className="btn-list flex-nowrap">
                                                                <CustomerEdit customerId={customer.id} fetchData={fetchData} />
                                                                <DeleteButton id={customer.id} endpoint={'/api/customers'} fetchData={fetchData} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                    : <tr>
                                                        <td colSpan="4" className="text-center">
                                                            <div className="alert alert-danger mb-0">
                                                                Data Belum Tersedia!
                                                            </div>
                                                        </td>
                                                    </tr>
                                            }

                                        </tbody>
                                    </table>
                                    <PaginationComponent
                                        currentPage={pagination.currentPage}
                                        perPage={pagination.perPage}
                                        total={pagination.total}
                                        onChange={(pageNumber) => fetchData(pageNumber, keywords)}
                                        position="end"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}