import moneyFormat from "../../../utils/moneyFormat";
import Api from "../../../service/api";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";

export default function ProductList({ products, fetchCarts }) {

    const token = Cookies.get("token");

    const addToCart = (product) => {

        if (token) {

            Api.defaults.headers.common['Authorization'] = token;

            Api.post('/api/carts', {
                product_id: product.id,
                qty: 1,
                price: product.sell_price
            })
                .then(response => {


                    toast.success(`${response.data.meta.message}`, {
                        duration: 4000,
                        position: "top-right",
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });


                    fetchCarts();

                });
        }

    }

    return (
        <div className='row mt-3'>
            {
                products.length > 0
                    ? products.map((product) => (
                        <div className='col-4' key={product.id}>
                            <div className="card card-link card-link-pop mt-3 rounded">
                                <div className="ribbon bg-success mt-3">
                                    <h4 className="mb-0">{moneyFormat(product.sell_price)}</h4>
                                </div>
                                <div className="card-body text-center">
                                    <img
                                        src={product.image?.startsWith('http') ? product.image : `${import.meta.env.VITE_APP_BASEURL}/uploads/${product.image.replace(/^uploads[\\/]/, '')}`}
                                        alt={product.title}
                                        className="me-2 rounded"
                                    />
                                    <h4 className="mb-0 mt-2">{product.title}</h4>
                                    <button className="btn btn-primary mt-3 w-100 rounded" onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                    : <div className="alert alert-danger mb-0">Product not available</div>
            }
        </div>
    );
}
