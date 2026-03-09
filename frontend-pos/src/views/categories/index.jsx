import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/admin";
import Cookies from "js-cookie";
import Api from "../../service/api";
import PaginationComponent from "../../components/Pagination";
import CategoryCreate from "./create";
import DeleteButton from "../../components/DeleteButton";
//import edit category
import CategoryEdit from "./edit";


export default function CategoriesIndex() {
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 0,
        total: 0
    });

    const [keywords, setKeywords] = useState("");
    // Image URL Helper
    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x400?text=No+Image";
        if (path.startsWith('http')) return path;
        const cleanPath = path.toString().replace(/\\/g, '/').replace(/^uploads[\\/]/, '');
        if (cleanPath.startsWith('http')) return cleanPath;
        return `${import.meta.env.VITE_APP_BASEURL}/uploads/${cleanPath}`;
    };

    const fetchData = async (pageNumber, keywords = "") => {
        const page = pageNumber ? pageNumber : pagination.currentPage;
        const token = Cookies.get("token");

        if (token) {
            Api.defaults.headers.common["Authorization"] = token;
            try {
                const response = await Api.get(
                    `/api/categories?page=${page}&search=${keywords}`
                );
                setCategories(response.data.data);
                setPagination(() => ({
                    currentPage: response.data.pagination.currentPage,
                    perPage: response.data.pagination.perPage,
                    total: response.data.pagination.total
                }));
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        } else {
            console.error("Token is not available!");
        }
    };

    useEffect(() => {
        console.log("BASE URL:", import.meta.env.VITE_APP_BASEURL);
        fetchData();
    }, []);

    const searchHandlder = () => {
        fetchData(1, keywords);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            searchHandlder();
        }
    };
    return (
        <LayoutAdmin>
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">HALAMAN</div>
                            <h2 className="page-title">CATEGORIES</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="input-group">
                                <CategoryCreate fetchData={fetchData} />
                                <input
                                    type="text"
                                    className="form-control"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="search by category name"
                                />
                                <button
                                    onClick={searchHandlder}
                                    className="btn btn-md btn-primary"
                                >SEARCH
                                </button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-vcenter table-mobile-md card-table">
                                        <thead>
                                            <tr>
                                                <th>Category Name</th>
                                                <th>Description</th>
                                                <th className="w-1">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.length > 0 ? (
                                                categories.map((category, index) => (
                                                    <tr key={index}>
                                                        <td data-label="Category Name">
                                                            <div className="d-flex py-1 align-items-center">
                                                                <span
                                                                    className="avatar me-2"
                                                                    style={{
                                                                        backgroundImage: `url(${getImageUrl(category.image)})`,
                                                                    }}
                                                                ></span>
                                                                <div className="flex-fill">
                                                                    <div className="font-weight-medium">
                                                                        {category.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-muted" data-label="Description">
                                                            {category.description}
                                                        </td>
                                                        <td>
                                                            <div className="btn-list flex-nowrap">
                                                                <CategoryEdit categoryId={category.id} fetchData={fetchData} />
                                                                <DeleteButton id={category.id} endpoint='/api/categories' fetchData={fetchData} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        <div className="alert alert-danger mb-0">
                                                            Data Belum Tersedia!
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
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
    );
} 