'use client';

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button, Spinner} from "reactstrap";
import {get} from "@/core/httpClient";

function logout() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    window.location.replace("/login");
}

function AdminAccess({children}) {
    const [status, setStatus] = useState("loading");
    const [email, setEmail] = useState("");

    useEffect(() => {
        let active = true;
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
            window.location.replace("/login");
            return;
        }

        const checkAccess = async () => {
            try {
                const response = await get("/auth/validate");

                if (!active || sessionStorage.getItem("accessToken") !== token) {
                    return;
                }

                const {valid, email, roles} = response.data;

                if (valid !== true || !Array.isArray(roles)) {
                    setStatus("error");
                    return;
                }

                setEmail(email);
                setStatus(roles.includes("ADMIN") ? "allowed" : "denied");
            } catch (error) {
                if (!active || sessionStorage.getItem("accessToken") !== token) {
                    return;
                }

                if (error.response?.status === 401) {
                    logout();
                } else {
                    setStatus(error.response?.status === 403 ? "denied" : "error");
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
            <div className="container py-4" role="status">
                <Spinner size="sm" aria-hidden="true" className="me-2"/>
                Provera pristupa…
            </div>
        );
    }

    return (
        <div className="container-fluid py-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <span>{email ? `Prijavljeni: ${email}` : "Pristup nalogu"}</span>
                <Button color="secondary" outline onClick={logout}>
                    Odjavi se
                </Button>
            </div>

            {status === "denied" && (
                <div className="alert alert-warning" role="alert">
                    <h1 className="h5">Nemate dozvolu za ovu stranicu.</h1>
                    <p>Ovaj deo aplikacije dostupan je administratorima.</p>
                    <Link href="/login" className="alert-link">Nazad na prijavu</Link>
                </div>
            )}

            {status === "error" && (
                <div className="alert alert-danger" role="alert">
                    <p>Provera pristupa nije uspela. Pokušajte ponovo.</p>
                    <Button color="secondary" onClick={() => window.location.reload()}>
                        Pokušaj ponovo
                    </Button>
                </div>
            )}

            {status === "allowed" && children}
        </div>
    );
}

export default function UserLayout({children}) {
    const pathname = usePathname();

    // Registracija ostaje javna; ostale postojeće /user stranice su administratorske.
    if (pathname === "/user/create") {
        return children;
    }

    return <AdminAccess key={pathname}>{children}</AdminAccess>;
}