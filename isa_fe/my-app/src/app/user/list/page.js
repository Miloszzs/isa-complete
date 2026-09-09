'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
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

    const handleLogout = () => {

        sessionStorage.removeItem(
            "accessToken"
        );

        sessionStorage.removeItem(
            "user"
        );

        sessionStorage.removeItem("coffeeShopCart");

        router.replace("/login");
    };

    const columns = [

        {
            name: "Ime",
            selector: row => row.firstName,
            sortable: true
        },

        {
            name: "Prezime",
            selector: row => row.lastName,
            sortable: true
        },

        {
            name: "Email",
            selector: row => row.email,
            sortable: true
        },

        {
            name: "Telefon",
            selector: row => row.contactNumber ?? ""
        },

        {
            name: "Akcije",

            cell: row => (

                <div className="d-flex gap-2">

                    <Button
                        color="primary"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/user/edit/${row.id}`
                            )
                        }
                    >
                        Izmeni
                    </Button>

                    <Button
                        color="danger"
                        size="sm"
                        onClick={() =>
                            handleDelete(row.id)
                        }
                    >
                        Obrisi
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

        <main>

            <nav className="navbar navbar-dark bg-dark">

                <div className="container">

                    <Link
                        href="/admin"
                        className="navbar-brand fw-bold"
                    >
                        Online Coffee Shop
                    </Link>

                    <div className="d-flex gap-2">

                        <Link
                            href="/admin"
                            className="btn btn-outline-light"
                        >
                            Admin panel
                        </Link>

                        <Link
                            href="/"
                            className="btn btn-outline-light"
                        >
                            Prodavnica
                        </Link>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleLogout}
                        >
                            Odjavi se
                        </button>

                    </div>

                </div>

            </nav>


            <div className="container py-5">

                <h1 className="h3 mb-4">
                    Lista korisnika
                </h1>


                {error ? (

                    <div className="alert alert-danger">

                        Greska pri ucitavanju korisnika.

                    </div>

                ) : (

                    <DataTable
                        data={data?.users ?? []}
                        columns={columns}
                        striped
                        pagination
                        paginationServer
                        progressPending={loading}
                        paginationTotalRows={
                            data?.totalElements ?? 0
                        }
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

                )}

            </div>

        </main>
    );
}