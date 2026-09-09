'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {get} from "@/core/httpClient";


export default function AdminOrdersPage() {

    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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

            if (!user.roles?.includes("ADMIN")) {
                router.replace("/");
                return;
            }

        } catch {

            router.replace("/login");
        }

    }, [router]);


    useEffect(() => {

        const loadOrders = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await get("/order/all");

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

    }, []);


    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date)
            .toLocaleString("sr-RS");
    };


    const handleLogout = () => {

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("coffeeShopCart");

        router.replace("/");
    };


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
                            Proizvodi
                        </Link>

                        <Link
                            href="/admin/categories"
                            className="btn btn-outline-light"
                        >
                            Kategorije
                        </Link>

                        <Link
                            href="/user/list"
                            className="btn btn-outline-light"
                        >
                            Korisnici
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

                <h1 className="mb-2">
                    Sve porudzbine
                </h1>

                <p className="text-secondary mb-4">
                    Administratorski pregled porudzbina kupaca
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

                    <div className="alert alert-secondary">
                        Trenutno nema porudzbina.
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
                                                {formatDate(order.orderDate)}
                                            </div>

                                        </div>


                                        <span className="badge text-bg-success">
                                            {order.status}
                                        </span>

                                    </div>

                                </div>


                                <div className="card-body">

                                    <p>
                                        <strong>Kupac:</strong>{" "}
                                        {order.customerEmail}
                                    </p>


                                    <div className="table-responsive">

                                        <table className="table table-sm align-middle">

                                            <thead>

                                            <tr>
                                                <th>Proizvod</th>
                                                <th>Cena</th>
                                                <th>Kolicina</th>
                                                <th>Ukupno</th>
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
                                                            Number(item.unitPrice) *
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


                                    <div className="text-end">

                                        <span className="text-secondary">
                                            Ukupna vrednost porudzbine:
                                        </span>

                                        <h2 className="h4 mt-1 mb-0">

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