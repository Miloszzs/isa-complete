'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function CustomerPage() {

    const router = useRouter();

    const [user, setUser] = useState(null);

    useEffect(() => {

        const token = sessionStorage.getItem("accessToken");
        const storedUser = sessionStorage.getItem("user");

        if (!token || !storedUser) {
            router.replace("/login");
            return;
        }

        try {

            const parsedUser = JSON.parse(storedUser);

            // Admin ima i CUSTOMER rolu,
            // zato ADMIN uvek saljemo na admin panel.
            if (parsedUser.roles?.includes("ADMIN")) {
                router.replace("/admin");
                return;
            }

            if (!parsedUser.roles?.includes("CUSTOMER")) {
                router.replace("/");
                return;
            }

            setUser(parsedUser);

        } catch (error) {

            console.error(error);
            router.replace("/login");
        }

    }, [router]);


    const handleLogout = () => {

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");

        router.replace("/");
    };


    if (!user) {

        return (
            <main className="container py-5">
                <div className="alert alert-info">
                    Ucitavanje korisnickog naloga...
                </div>
            </main>
        );
    }


    return (

        <main>

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
                    Moj nalog
                </h1>


                <div className="row">

                    <div className="col-12 col-lg-6">

                        <div className="card shadow-sm">

                            <div className="card-body">

                                <h2 className="h4 mb-4">
                                    Podaci o korisniku
                                </h2>

                                <p>
                                    <strong>ID korisnika:</strong>{" "}
                                    {user.userId}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {user.email}
                                </p>

                                <p className="mb-0">
                                    <strong>Uloga:</strong>{" "}
                                    {user.roles?.join(", ")}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="mt-4">

                    <Link
                        href="/"
                        className="btn btn-primary"
                    >
                        Pogledaj ponudu kafe
                    </Link>

                </div>

            </div>

        </main>
    );
}