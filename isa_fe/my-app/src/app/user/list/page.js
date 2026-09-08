'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import useListData from "@/hooks/useListData";
import DataTable from "react-data-table-component";
import {Button, Spinner} from "reactstrap";
import {remove} from "@/core/httpClient";

export default function UserList() {

    const router = useRouter();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        getData,
        loading,
        data,
        error
    } = useListData();

    const loadUsers = () => {
        getData("/user/get-user-page-list", {
            pageNumber: pageNumber - 1,
            pageSize: pageSize
        });
    };

    useEffect(() => {
        loadUsers();
    }, [getData, pageNumber, pageSize]);

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Da li ste sigurni da zelite da obrisete korisnika?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await remove(`/user/${id}`);

            loadUsers();
        } catch (error) {
            console.error(
                "Greska pri brisanju korisnika:",
                error
            );
        }
    };

    const columns = [
        {
            name: "First Name",
            selector: row => row.firstName
        },
        {
            name: "Last Name",
            selector: row => row.lastName
        },
        {
            name: "Email",
            selector: row => row.email
        },
        {
            name: "Phone",
            selector: row => row.contactNumber ?? ""
        },
        {
            name: "Actions",
            cell: row => (
                <div className="d-flex gap-2">

                    <Button
                        color="primary"
                        size="sm"
                        onClick={() =>
                            router.push(`/user/edit/${row.id}`)
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        color="danger"
                        size="sm"
                        onClick={() =>
                            handleDelete(row.id)
                        }
                    >
                        Delete
                    </Button>

                </div>
            )
        }
    ];

    if (error) {
        return (
            <div className="alert alert-danger">
                Greska pri ucitavanju korisnika.
            </div>
        );
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
            progressComponent={
                <Spinner color="danger"/>
            }
            highlightOnHover
        />
    );
}