'use client';

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

import {post} from "@/core/httpClient";
import {
    getCart,
    saveCart,
    clearCart
} from "@/core/cart";


export default function CartPage() {

    const router = useRouter();

    const [cart, setCart] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [createdOrder, setCreatedOrder] = useState(null);


    // =====================================================
    // PROVERA KORISNIKA I UCITAVANJE KORPE
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
            setCart(getCart());

        } catch (error) {

            console.error(error);

            router.replace("/login");
        }

    }, [router]);


    // =====================================================
    // CUVANJE KORPE
    // =====================================================

    const updateCart = (newCart) => {

        setCart(newCart);

        saveCart(newCart);
    };


    // =====================================================
    // POVECANJE KOLICINE
    // =====================================================

    const increaseQuantity = (productId) => {

        const newCart = cart.map(item => {

            if (item.productId === productId) {

                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            }

            return item;
        });

        updateCart(newCart);
    };


    // =====================================================
    // SMANJENJE KOLICINE
    // =====================================================

    const decreaseQuantity = (productId) => {

        const newCart = cart.map(item => {

            if (
                item.productId === productId &&
                item.quantity > 1
            ) {

                return {
                    ...item,
                    quantity: item.quantity - 1
                };
            }

            return item;
        });

        updateCart(newCart);
    };


    // =====================================================
    // BRISANJE PROIZVODA IZ KORPE
    // =====================================================

    const removeFromCart = (productId) => {

        const newCart = cart.filter(
            item => item.productId !== productId
        );

        updateCart(newCart);
    };


    // =====================================================
    // UKUPNA CENA
    // =====================================================

    const totalPrice = useMemo(() => {

        return cart.reduce(
            (total, item) => {

                return total +
                    Number(item.price) *
                    item.quantity;
            },
            0
        );

    }, [cart]);


    // =====================================================
    // UKUPAN BROJ PROIZVODA
    // =====================================================

    const totalItems = useMemo(() => {

        return cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    }, [cart]);


    // =====================================================
    // POTVRDA PORUDZBINE
    // =====================================================

    const handleCreateOrder = async () => {

        if (cart.length === 0) {

            setError(
                "Korpa je prazna."
            );

            return;
        }

        setLoading(true);
        setMessage("");
        setError("");
        setCreatedOrder(null);


        const orderData = {

            items: cart.map(item => ({

                productId: item.productId,

                quantity: item.quantity
            }))
        };


        try {

            const response = await post(
                "/order/create",
                orderData
            );

            setCreatedOrder(
                response.data
            );

            setMessage(
                "Porudzbina je uspesno kreirana."
            );

            clearCart();

            setCart([]);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                setError(
                    "Sesija je istekla. Prijavite se ponovo."
                );

            } else if (error.response?.status === 404) {

                setError(
                    error.response?.data ||
                    "Jedan od proizvoda vise ne postoji."
                );

            } else {

                setError(
                    error.response?.data ||
                    "Kreiranje porudzbine nije uspelo."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        sessionStorage.removeItem(
            "accessToken"
        );

        sessionStorage.removeItem(
            "user"
        );

        sessionStorage.removeItem(
            "coffeeShopCart"
        );

        router.replace("/");
    };


    // =====================================================
    // UCITAVANJE
    // =====================================================

    if (!currentUser) {

        return (

            <main className="container py-5">

                <div className="alert alert-info">
                    Ucitavanje korpe...
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

                <h1 className="mb-4">
                    Moja korpa
                </h1>


                {/* PORUKE */}

                {message && (

                    <div className="alert alert-success">

                        {message}

                    </div>

                )}


                {error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>

                )}


                {/* USPESNA PORUDZBINA */}

                {createdOrder && (

                    <div className="card border-success mb-4">

                        <div className="card-body">

                            <h2 className="h5">
                                Porudzbina #{createdOrder.orderId}
                            </h2>

                            <p className="mb-1">

                                <strong>
                                    Ukupna cena:
                                </strong>{" "}

                                {Number(
                                    createdOrder.totalPrice
                                ).toLocaleString("sr-RS")} RSD

                            </p>

                            <p className="mb-1">

                                <strong>
                                    Status:
                                </strong>{" "}

                                {createdOrder.status}

                            </p>

                            <p className="mb-0">

                                <strong>
                                    Broj stavki:
                                </strong>{" "}

                                {createdOrder.itemsCount}

                            </p>

                        </div>

                    </div>

                )}


                {/* PRAZNA KORPA */}

                {cart.length === 0 ? (

                    <div>

                        <div className="alert alert-secondary">

                            Korpa je trenutno prazna.

                        </div>

                        <Link
                            href="/"
                            className="btn btn-primary"
                        >
                            Pogledaj proizvode
                        </Link>

                    </div>

                ) : (

                    <>

                        {/* TABELA KORPE */}

                        <div className="table-responsive">

                            <table className="table table-striped align-middle">

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

                                    <th>
                                        Akcije
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {cart.map(item => (

                                    <tr key={item.productId}>

                                        <td>

                                            {item.name}

                                        </td>


                                        <td>

                                            {Number(
                                                item.price
                                            ).toLocaleString("sr-RS")} RSD

                                        </td>


                                        <td>

                                            <div className="d-flex align-items-center gap-2">

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.productId
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span className="fw-bold">

                                                    {item.quantity}

                                                </span>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.productId
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </td>


                                        <td>

                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toLocaleString("sr-RS")} RSD

                                        </td>


                                        <td>

                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.productId
                                                    )
                                                }
                                            >
                                                Obrisi
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>


                        {/* UKUPNA CENA */}

                        <div className="card shadow-sm mt-4">

                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <p className="mb-1 text-secondary">

                                            Broj proizvoda:

                                        </p>

                                        <strong>

                                            {totalItems}

                                        </strong>

                                    </div>


                                    <div className="text-end">

                                        <p className="mb-1 text-secondary">

                                            Ukupna cena:

                                        </p>

                                        <h2 className="h4 mb-0">

                                            {totalPrice.toLocaleString(
                                                "sr-RS"
                                            )} RSD

                                        </h2>

                                    </div>

                                </div>


                                <hr/>


                                <div className="d-flex justify-content-between">

                                    <Link
                                        href="/"
                                        className="btn btn-outline-secondary"
                                    >
                                        Nastavi kupovinu
                                    </Link>


                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={loading}
                                        onClick={
                                            handleCreateOrder
                                        }
                                    >

                                        {loading
                                            ? "Kreiranje porudzbine..."
                                            : "Potvrdi porudzbinu"}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </main>
    );
}