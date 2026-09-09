'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {getCartCount} from "@/core/cart";

export default function CustomerPage() {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);


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

            const parsedUser =
                JSON.parse(storedUser);


            // Admin ima i CUSTOMER rolu,
            // zato ADMIN ide na admin panel.
            if (parsedUser.roles?.includes("ADMIN")) {

                router.replace("/admin");
                return;
            }


            if (!parsedUser.roles?.includes("CUSTOMER")) {

                router.replace("/");
                return;
            }


            setUser(parsedUser);

            setCartCount(
                getCartCount()
            );

        } catch (error) {

            console.error(error);

            router.replace("/login");
        }

    }, [router]);


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
    // LOADING
    // =====================================================

    if (!user) {

        return (

            <main className="min-vh-100 bg-light">

                <div className="container py-5">

                    <div className="alert alert-info">
                        Ucitavanje korisnickog naloga...
                    </div>

                </div>

            </main>
        );
    }


    return (

        <main className="min-vh-100 bg-light">


            {/* =================================================
                NAVBAR
            ================================================= */}

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
                            Korpa ({cartCount})
                        </Link>

                        <Link
                            href="/customer/orders"
                            className="btn btn-outline-light"
                        >
                            Moje porudzbine
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


            {/* =================================================
                HERO / POZDRAV
            ================================================= */}

            <section className="bg-white border-bottom">

                <div className="container py-5">

                    <div className="row align-items-center">

                        <div className="col-12 col-lg-8">

                            <div className="d-flex align-items-center gap-3">

                                <div
                                    className="bg-dark text-white rounded-circle
                                               d-flex align-items-center
                                               justify-content-center flex-shrink-0"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        fontSize: "32px"
                                    }}
                                >
                                    ☕
                                </div>


                                <div>

                                    <p className="text-secondary mb-1">
                                        Korisnicki nalog
                                    </p>

                                    <h1 className="h2 fw-bold mb-1">
                                        Dobrodosli u Coffee Shop
                                    </h1>

                                    <p className="text-secondary mb-0">
                                        {user.email}
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="col-12 col-lg-4 mt-4 mt-lg-0 text-lg-end">

                            <Link
                                href="/"
                                className="btn btn-dark btn-lg"
                            >
                                Pogledaj ponudu
                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                GLAVNI SADRZAJ
            ================================================= */}

            <div className="container py-5">


                {/* BRZE AKCIJE */}

                <div className="mb-5">

                    <h2 className="h4 mb-3">
                        Brze akcije
                    </h2>


                    <div className="row g-4">


                        {/* PRODAVNICA */}

                        <div className="col-12 col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div
                                        className="fs-2 mb-3"
                                        aria-hidden="true"
                                    >
                                        ☕
                                    </div>

                                    <h3 className="h5">
                                        Prodavnica
                                    </h3>

                                    <p className="text-secondary">
                                        Pregledajte ponudu kafe i
                                        dodajte proizvode u korpu.
                                    </p>

                                    <Link
                                        href="/"
                                        className="btn btn-dark"
                                    >
                                        Pogledaj proizvode
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* KORPA */}

                        <div className="col-12 col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div
                                        className="fs-2 mb-3"
                                        aria-hidden="true"
                                    >
                                        🛒
                                    </div>

                                    <h3 className="h5">
                                        Moja korpa
                                    </h3>

                                    <p className="text-secondary">

                                        Trenutno imate{" "}

                                        <strong>
                                            {cartCount}
                                        </strong>{" "}

                                        {cartCount === 1
                                            ? "proizvod"
                                            : "proizvoda"}{" "}

                                        u korpi.

                                    </p>

                                    <Link
                                        href="/cart"
                                        className="btn btn-outline-dark"
                                    >
                                        Otvori korpu
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* PORUDZBINE */}

                        <div className="col-12 col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div
                                        className="fs-2 mb-3"
                                        aria-hidden="true"
                                    >
                                        📦
                                    </div>

                                    <h3 className="h5">
                                        Moje porudzbine
                                    </h3>

                                    <p className="text-secondary">
                                        Pregledajte istoriju svojih
                                        prethodnih kupovina.
                                    </p>

                                    <Link
                                        href="/customer/orders"
                                        className="btn btn-outline-dark"
                                    >
                                        Pregled porudzbina
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PODACI O NALOGU
                ================================================= */}

                <div className="row">

                    <div className="col-12 col-lg-8">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between
                                                align-items-center mb-4">

                                    <h2 className="h4 mb-0">
                                        Podaci o nalogu
                                    </h2>

                                    <span className="badge text-bg-success">
                                        Aktivan nalog
                                    </span>

                                </div>


                                <div className="row g-4">


                                    <div className="col-12 col-md-4">

                                        <p className="text-secondary small mb-1">
                                            ID korisnika
                                        </p>

                                        <p className="fw-semibold mb-0">
                                            #{user.userId}
                                        </p>

                                    </div>


                                    <div className="col-12 col-md-5">

                                        <p className="text-secondary small mb-1">
                                            Email adresa
                                        </p>

                                        <p className="fw-semibold mb-0">
                                            {user.email}
                                        </p>

                                    </div>


                                    <div className="col-12 col-md-3">

                                        <p className="text-secondary small mb-1">
                                            Uloga
                                        </p>

                                        <span className="badge text-bg-dark">
                                            CUSTOMER
                                        </span>

                                    </div>


                                </div>

                            </div>

                        </div>

                    </div>


                    {/* INFO KARTICA */}

                    <div className="col-12 col-lg-4 mt-4 mt-lg-0">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body p-4">

                                <h2 className="h5 mb-3">
                                    Online Coffee Shop
                                </h2>

                                <p className="text-secondary mb-0">
                                    Izaberite kafu iz nase ponude,
                                    dodajte je u korpu i jednostavno
                                    kreirajte porudzbinu.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}