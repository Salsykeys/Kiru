import ReactPaginate from "react-paginate";

function PaginationComponent(props) {
    const pageCount = Math.ceil(props.total / props.perPage);

    return (
        props.total > 0 && (
            <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={(data) => props.onChange(data.selected + 1)}
                forcePage={props.currentPage - 1}
                containerClassName={`pagination justify-content-${props.position} mb-2 mt-2`}
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
            />
        )
    )
}

export default PaginationComponent;
