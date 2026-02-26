import Api from '../service/api';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function DeleteButton ({ id, endpoint, fetchData}){
    const token = Cookies.get('token');
    const confirmDelete = () => {
        confirmAlert({
            title : "yakin ga",
            message : "serius mau dihapus nih?",
            buttons: [
                {
                    label: 'y',
                    onClick : deleteData
                },
                {
                    label : 'g',
                    onClick : () => {}
                }
            ]
        });
    };

    const deleteData = async () => {
        try { 

            Api.defaults.headers.common['Authorization'] = token;
            await Api.delete(`${endpoint}/${id}`)
            .then((response) => {
                toast.success(`${response.data.meta.message}!`,{
                    duration : 4000,
                    position : "top-right",
                    style: {
                        borderRadius : '10px',
                        background : '#333',
                        color : '#fff',
                    },
                });

                fetchData();
            })
        } catch (error) {
            toast.error("Failed to delete data!",{
                duration : 4000,
                position : "top-right",
                style:{
                    borderRadius: '10px',
                    backround : '#333',
                    color : '#fff',
            },
        });
    }
};

return (
    <button className = "btn btn-danger rounded " onClick= {confirmDelete}>
        Delete
    </button>
);

}