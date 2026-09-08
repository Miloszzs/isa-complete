'use client';

import {useEffect, useState} from "react";
import useListData from "@/hooks/useListData";
import DataTable from "react-data-table-component";
import {Spinner} from "reactstrap";

const columns = [
    {name: "First Name", selector: row => row.firstName},
    {name: "Last Name", selector: row => row.lastName},
    {name: "Email", selector: row => row.email},
    {name: "Phone", selector: row => row.contactNumber ?? ""},
];

export default function UserList() {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {getData, loading, data, error} = useListData();

    useEffect(() => {
        getData("/user/get-user-page-list", {
            pageNumber: pageNumber - 1,
            pageSize: pageSize,
        });
    }, [getData, pageNumber, pageSize]);

    if (error) {
        return <div className="alert alert-danger">
            Greska pri ucitavanju korisnika.
        </div>;
    }

    return (
        <DataTable
            data={data?.users ?? []}
            columns={columns}
            striped
            pagination
            paginationServer
            progressPending={loading}
            paginationTotalRows={data?.totalElements ?? 0}
            onChangePage={setPageNumber}
            onChangeRowsPerPage={(size, page) => {
                setPageSize(size);
                setPageNumber(page);
            }}
            progressComponent={<Spinner color="danger" />}
            highlightOnHover
        />
    );
}