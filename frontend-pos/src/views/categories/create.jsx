import { useState, useRef } from "react";

import Cookies from "js-cookie";

import toast from "react-hot-toast";

import Api from "../../service/api";

import { handleErrors } from "../../utils/handleErrors";

function CategoryCreate({ fetchData }) {
    const [name, setName] = useState('');
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState({})

    const fileInputRef = useRef(null)
    const modalRef = useRef(null)

    const token = Cookies.get('token')

    const handleFileChange = (e) => {
        const imageData = e.target.files[0]

        if (!imageData.type.match('image.*')) {
            fileInputRef.current.value = ''
            setImage('')
            toast.error('Format files not supported', {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return
        }
        setImage(imageData)
    }

    const storeCategory = async (e) => {
        e.preventDefault()

        const formData = new FormData();

        formData.append('image', image);
        formData.append('name', name);
        formData.append('description', description);

        Api.defaults.headers.common['Authorization'] = token;
        await Api.post('/api/categories', formData).then((response) => {
            toast.success(`${response.data.meta.message}`, {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#fff',
                },
            });

            const modalElement = modalRef.current;
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            fetchData();


            fileInputRef.current.value = '';
            setImage('');
            setName('');
            setDescription('');

        })
            .catch((error) => {
                handleErrors(error.response.data, setErrors);

            })
    }

    return (
        <>
            <a href="#" className="btn btn-primary d-sm-inline-block" data-bs-toggle="modal" data-bs-target="#modal-create-category">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                Add New
            </a>
            <div className="modal modal-blur fade" id="modal-create-category" tabIndex="-1" role="dialog" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-lg modal-dialog-centered " role="document">
                    <form onSubmit={storeCategory}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New Category</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Image</label>
                                            <input type="file" className="form-control" onChange={handleFileChange} ref={fileInputRef} />
                                            {
                                                errors.image && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.image}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Category Name</label>
                                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Category Name' />
                                            {
                                                errors.name && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.name}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div>
                                            <label className="form-label">Description</label>
                                            <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter Description'></textarea>
                                            {
                                                errors.description && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.description}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <a href="#" className="btn me-auto rounded" data-bs-dismiss="modal">
                                    Cancel
                                </a>
                                <button type='submit' className="btn btn-primary ms-auto rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}


export default CategoryCreate;
