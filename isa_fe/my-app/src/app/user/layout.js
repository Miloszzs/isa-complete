'use client';

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button, Spinner} from "reactstrap";
import {get} from "@/core/httpClient";


function logout() {

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("coffeeShopCart");

    window.location.replace("/login");
}


function AdminAccess({children}) {

    const [status, setStatus] = useState("loading");


    useEffect(() => {

        let active = true;

        const token =
            sessionStorage.getItem("accessToken");

        if (!token) {

            window.location.replace("/login");
            return;
        }


        const checkAccess = async () => {

            try {

                const response =
                    await get("/auth/validate");

                if (
                    !active ||
                    sessionStorage.getItem("accessToken") !== token
                ) {
                    return;
                }

                const {
                    valid,
                    roles
                } = response.data;


                if (
                    valid !== true ||
                    !Array.isArray(roles)
                ) {

                    setStatus("error");
                    return;
                }


                setStatus(
                    roles.includes("ADMIN")
                        ? "allowed"
                        : "denied"
                );

            } catch (error) {

                if (
                    !active ||
                    sessionStorage.getItem("accessToken") !== token
                ) {
                    return;
                }

                if (error.response?.status === 401) {

                    logout();

                } else {

                    setStatus(
                        error.response?.status === 403
                            ? "denied"
                            : "error"
                    );
                }
            }
        };


        checkAccess();


        return () => {
            active = false;
        };

    }, []);


    if (status === "loading") {

        return (

            <div
                className="container py-5"
                role="status"
            >

                <Spinner
                    size="sm"
                    aria-hidden="true"
                    className="me-2"
                />

                Provera pristupa...

            </div>
        );
    }


    if (status === "denied") {

        return (

            <div className="container py-5">

                <div
                    className="alert alert-warning"
                    role="alert"
                >

                    <h1 className="h5">
                        Nemate dozvolu za ovu stranicu.
                    </h1>

                    <p>
                        Ovaj deo aplikacije dostupan je
                        samo administratorima.
                    </p>

                    <Link
                        href="/"
                        className="alert-link"
                    >
                        Nazad na pocetnu stranicu
                    </Link>

                </div>

            </div>
        );
    }


    if (status === "error") {

        return (

            <div className="container py-5">

                <div
                    className="alert alert-danger"
                    role="alert"
                >

                    <p>
                        Provera pristupa nije uspela.
                        Pokusajte ponovo.
                    </p>

                    <Button
                        color="secondary"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Pokusaj ponovo
                    </Button>

                </div>

            </div>
        );
    }


    // Ako je ADMIN, layout samo propusta stranicu.
    // Navigacija se nalazi u samoj stranici.
    return children;
}


export default function UserLayout({children}) {

    const pathname = usePathname();

    // Registracija je javna.
    if (pathname === "/user/create") {
        return children;
    }

    return (
        <AdminAccess key={pathname}>
            {children}
        </AdminAccess>
    );
}