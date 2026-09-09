'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {get} from "@/core/httpClient";

export default function CustomerOrdersPage() {

    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // PROVERA KORISNIKA
    // =====================================================

    useEffect(() => {

        const token =
            sessionStorage.getItem("accessToken");

        const storedUser =
            sessionStorage.getItem("user");

        if (!token || !storedUser) {
            router.replace("/login");
            return;
        }

        try {

            const user =
                JSON.parse(storedUser);

            if (user.roles?.includes("ADMIN")) {
                router.replace("/admin");
                return;
            }

            if (!user.roles?.includes("CUSTOMER")) {
                router.replace("/");
                return;
            }

            setCurrentUser(user);

        } catch (error) {

            console.error(error);
            router.replace("/login");
        }

    }, [router]);


    // =====================================================
    // UCITAVANJE PORUDZBINA
    // =====================================================

    useEffect(() => {

        if (!currentUser) {
            return;
        }

        const loadOrders = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await get("/order/my-orders");

                setOrders(
                    response.data ?? []
                );

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data ||
                    "Nije moguce ucitati porudzbine."
                );

            } finally {

                setLoading(false);
            }
        };

        loadOrders();

    }, [currentUser]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("coffeeShopCart");

        router.replace("/");
    };


    // =====================================================
    // FORMAT DATUMA
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "sr-RS"
        );
    };


    if (!currentUser) {

        return (
            <main className="container py-5">

                <div className="alert alert-info">
                    Ucitavanje...
                </div>

            </main>
        );
    }


    return (

        <main>

            {/* NAVBAR */}

            <nav className="navbar navbar-dark bg-dark">

                <div className="container">

                    <Link
                        href="/"
                        className="navbar-brand fw-bold"
                    >
                        Online Coffee Shop
                    </Link>

                    <div className="d-flex gap-2">

                        <Link
                            href="/"
                            className="btn btn-outline-light"
                        >
                            Prodavnica
                        </Link>

                        <Link
                            href="/cart"
                            className="btn btn-outline-light"
                        >
                            Korpa
                        </Link>

                        <Link
                            href="/customer"
                            className="btn btn-outline-light"
                        >
                            Moj nalog
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

                <h1 className="mb-2">
                    Moje porudzbine
                </h1>

                <p className="text-secondary mb-4">
                    Pregled prethodnih kupovina
                </p>


                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {loading ? (

                    <div className="alert alert-info">
                        Ucitavanje porudzbina...
                    </div>

                ) : orders.length === 0 ? (

                    <div>

                        <div className="alert alert-secondary">
                            Jos uvek nemate porudzbina.
                        </div>

                        <Link
                            href="/"
                            className="btn btn-primary"
                        >
                            Pogledaj proizvode
                        </Link>

                    </div>

                ) : (

                    <div className="d-flex flex-column gap-4">

                        {orders.map(order => (

                            <div
                                className="card shadow-sm"
                                key={order.orderId}
                            >

                                <div className="card-header">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <strong>
                                                Porudzbina #{order.orderId}
                                            </strong>

                                            <div className="text-secondary small">

                                                {formatDate(
                                                    order.orderDate
                                                )}

                                            </div>

                                        </div>


                                        <span className="badge text-bg-success">

                                            {order.status}

                                        </span>

                                    </div>

                                </div>


                                <div className="card-body">

                                    <div className="table-responsive">

                                        <table className="table table-sm align-middle">

                                            <thead>

                                            <tr>

                                                <th>
                                                    Proizvod
                                                </th>

                                                <th>
                                                    Cena
                                                </th>

                                                <th>
                                                    Kolicina
                                                </th>

                                                <th>
                                                    Ukupno
                                                </th>

                                            </tr>

                                            </thead>


                                            <tbody>

                                            {order.items?.map(item => (

                                                <tr key={item.orderItemId}>

                                                    <td>
                                                        {item.productName}
                                                    </td>

                                                    <td>

                                                        {Number(
                                                            item.unitPrice
                                                        ).toLocaleString(
                                                            "sr-RS"
                                                        )} RSD

                                                    </td>

                                                    <td>
                                                        {item.quantity}
                                                    </td>

                                                    <td>

                                                        {(
                                                            Number(
                                                                item.unitPrice
                                                            ) *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            "sr-RS"
                                                        )} RSD

                                                    </td>

                                                </tr>

                                            ))}

                                            </tbody>

                                        </table>

                                    </div>


                                    <div className="text-end mt-3">

                                        <span className="text-secondary">
                                            Ukupna vrednost:
                                        </span>

                                        <h2 className="h4 mt-1">

                                            {Number(
                                                order.totalPrice
                                            ).toLocaleString(
                                                "sr-RS"
                                            )} RSD

                                        </h2>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}