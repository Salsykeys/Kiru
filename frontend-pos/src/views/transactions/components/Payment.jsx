import { useState, useEffect } from 'react'
import moneyFormat from "../../../utils/moneyFormat";
import Cookies from 'js-cookie';
import Api from "../../../service/api";
import Select from 'react-select'
import toast from "react-hot-toast";

export default function Payment({ totalCarts, fetchCarts }) {

    //set state
    const [cash, setCash] = useState('')
    const [discount, setDiscount] = useState('')
    const [usePoints, setUsePoints] = useState(false)

    //state customers
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    // calculate points to use
    const availablePoints = selectedCustomer?.points || 0;
    // max points that can be used is either the total points available or the grandTotal without points, whichever is smaller.
    // wait, discount is a separate field. Let's make point deduction a separate thing from discount.
    const grandTotalBeforePoints = totalCarts - (parseInt(discount) || 0);
    const pointsUsed = usePoints ? Math.min(availablePoints, grandTotalBeforePoints) : 0;
    const grandTotal = grandTotalBeforePoints - pointsUsed;

    // derived state for change
    const change = cash !== '' ? parseInt(cash) - grandTotal : 0;

    //function setDiscount
    function calculateDiscount(e) {
        //set discount
        setDiscount(e.target.value)

        //set cash
        setCash(0)
    }

    function calculateChange(e) {
        //set cash
        setCash(e.target.value)
    }


    const fetchCustomers = async () => {
        const token = Cookies.get('token');

        if (token) {
            //set authorization header with token
            Api.defaults.headers.common['Authorization'] = token;

            await Api.get('/api/customers-all')
                .then(response => {
                    //set data response to state "customers"
                    setCustomers(response.data.data);
                });
        }
    }

    //hook useEffect
    useEffect(() => {
        fetchCustomers()
    }, [])


    //function storeTransaction
    const storeTransaction = async () => {

        const token = Cookies.get('token');

        if (token) {

            Api.defaults.headers.common['Authorization'] = token;

            await Api.post('/api/transactions', {
                customer_id: selectedCustomer?.value || null,
                discount: parseInt(discount) || 0,
                cash: parseInt(cash),
                change: parseInt(change),
                grand_total: parseInt(grandTotal),
                points_used: pointsUsed
            })
                .then(response => {

                    //show toast
                    toast.success(response.data.meta.message, {
                        duration: 4000,
                        position: "top-right",
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });

                    let earnedMsg = '';
                    if (response.data.data.points_earned) {
                        earnedMsg = `\nMendapatkan ${response.data.data.points_earned} K-Points!`;
                        toast.success(`${earnedMsg}`, {
                            duration: 4000,
                            position: "top-right",
                            style: {
                                borderRadius: '10px',
                                background: '#198754',
                                color: '#fff',
                            },
                        });
                    }

                    // Reset internal states after success
                    setCash('');
                    setDiscount('');
                    setUsePoints(false);
                    setSelectedCustomer(null);

                    //fetchCarts
                    fetchCarts();

                    window.open(`/transactions/print?invoice=${response.data.data.invoice}`, '_blank');
                })
                .catch(err => {
                    toast.error(err.response?.data?.meta?.message || 'Transaction failed');
                });
        }
    }

    return (
        <>
            <button
                className='btn btn-warning w-100 rounded'
                data-bs-toggle="modal"
                data-bs-target="#modal-pay"
                disabled={totalCarts === 0}
            >
                Pay
            </button>

            <div className="modal modal-blur fade" id="modal-pay" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Payment Cash</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="card rounded bg-muted-lt">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4 col-4">
                                            <h4 className="fw-bold">GRAND TOTAL</h4>
                                        </div>
                                        <div className="col-md-8 col-8 text-end">
                                            {pointsUsed > 0 && (
                                                <h5 className="text-muted mb-1 text-decoration-line-through">
                                                    {moneyFormat(grandTotalBeforePoints)}
                                                </h5>
                                            )}
                                            <h2 className="fw-bold">{moneyFormat(grandTotal)}</h2>
                                            <div>
                                                <hr />
                                                <h3 className="text-success">Change : <strong>{moneyFormat(change)}</strong></h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2 mt-3">
                                <div className="col-md-6">
                                    <label className='mb-1'>Customer</label>
                                    <Select
                                        options={customers}
                                        value={selectedCustomer}
                                        onChange={(e) => {
                                            setSelectedCustomer(e);
                                            setUsePoints(false); // reset points usage when changing customer
                                        }}
                                        isClearable
                                        formatOptionLabel={(option) => (
                                            <div className="d-flex justify-content-between">
                                                <span>{option.label}</span>
                                                <span className="badge bg-green-lt">{option.points || 0} pts</span>
                                            </div>
                                        )}
                                    />
                                    {selectedCustomer && availablePoints > 0 && (
                                        <div className="mt-2 form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="usePointsCheck" 
                                                checked={usePoints}
                                                onChange={(e) => setUsePoints(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="usePointsCheck">
                                                Gunakan K-Points ({availablePoints} available) <br />
                                                <small className="text-muted">Potongan: {moneyFormat(pointsUsed)}</small>
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className='mb-1'>Discount (Rp.)</label>
                                    <input type="number" className="form-control" placeholder="Discount (Rp.)" value={discount} onChange={(e) => calculateDiscount(e)} />
                                </div>
                            </div>
                            <div className="row mb-2 mt-3">
                                <div className="col-md-12">
                                    <label className='mb-1'>Cash (Rp.)</label>
                                    <input type="number" className="form-control form-control-lg" placeholder="Cash (Rp.)" value={cash} onChange={(e) => calculateChange(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn me-auto rounded" data-bs-dismiss="modal">Close</button>
                            <button onClick={storeTransaction} disabled={cash < grandTotal || grandTotal === 0} className="btn btn-primary rounded" data-bs-dismiss="modal">Pay Order + Print</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
