'use client';

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {post} from "@/core/httpClient";

export default function Login() {

    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        resetField,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });


    const onSubmit = async (values) => {

        setErrorMessage("");

        try {

            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");

            const response = await post(
                "/auth/login",
                {
                    email: values.email.trim(),
                    password: values.password
                }
            );

            const {
                accessToken,
                userId,
                email,
                roles
            } = response.data;


            if (!accessToken || !Array.isArray(roles)) {

                setErrorMessage(
                    "Server nije vratio podatke potrebne za prijavu."
                );

                return;
            }


            sessionStorage.setItem(
                "user",
                JSON.stringify({
                    userId,
                    email,
                    roles
                })
            );

            sessionStorage.setItem(
                "accessToken",
                accessToken
            );


            resetField("password");


            if (roles.includes("ADMIN")) {

                router.replace("/admin");

            } else if (roles.includes("CUSTOMER")) {

                router.replace("/customer");

            } else {

                router.replace("/");
            }

        } catch (error) {

            if (error.response?.status === 401) {

                setErrorMessage(
                    "Pogresan email ili lozinka."
                );

            } else if (error.response?.status === 400) {

                setErrorMessage(
                    "Proverite uneti email i lozinku."
                );

            } else {

                setErrorMessage(
                    "Prijava nije uspela. Pokusajte ponovo."
                );
            }
        }
    };


    return (

        <main className="min-vh-100 bg-light">

            {/* NAVBAR */}

            <nav className="navbar navbar-dark bg-dark">

                <div className="container">

                    <Link
                        href="/"
                        className="navbar-brand fw-bold"
                    >
                        Online Coffee Shop
                    </Link>

                    <Link
                        href="/"
                        className="btn btn-outline-light"
                    >
                        Nazad u prodavnicu
                    </Link>

                </div>

            </nav>


            {/* LOGIN */}

            <div className="container py-5">

                <div className="row justify-content-center">

                    <div className="col-12 col-md-7 col-lg-5 col-xl-4">

                        <div className="text-center mb-4">

                            <div
                                className="display-4 mb-2"
                                aria-hidden="true"
                            >
                                ☕
                            </div>

                            <h1 className="h2 fw-bold">
                                Dobrodosli nazad
                            </h1>

                            <p className="text-secondary">
                                Prijavite se na svoj Coffee Shop nalog
                            </p>

                        </div>


                        <div className="card border-0 shadow">

                            <div className="card-body p-4 p-md-5">

                                <h2 className="h4 mb-4">
                                    Prijava
                                </h2>


                                {errorMessage && (

                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {errorMessage}
                                    </div>

                                )}


                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                >

                                    <fieldset disabled={isSubmitting}>

                                        {/* EMAIL */}

                                        <div className="mb-3">

                                            <label
                                                htmlFor="email"
                                                className="form-label fw-semibold"
                                            >
                                                Email adresa
                                            </label>

                                            <input
                                                id="email"
                                                type="email"
                                                autoComplete="username"
                                                placeholder="ime@example.com"
                                                className={
                                                    `form-control ${
                                                        errors.email
                                                            ? "is-invalid"
                                                            : ""
                                                    }`
                                                }
                                                {...register(
                                                    "email",
                                                    {
                                                        required:
                                                            "Email je obavezan."
                                                    }
                                                )}
                                            />

                                            {errors.email && (

                                                <div className="invalid-feedback">
                                                    {errors.email.message}
                                                </div>

                                            )}

                                        </div>


                                        {/* PASSWORD */}

                                        <div className="mb-4">

                                            <label
                                                htmlFor="password"
                                                className="form-label fw-semibold"
                                            >
                                                Lozinka
                                            </label>

                                            <input
                                                id="password"
                                                type="password"
                                                autoComplete="current-password"
                                                placeholder="Unesite lozinku"
                                                className={
                                                    `form-control ${
                                                        errors.password
                                                            ? "is-invalid"
                                                            : ""
                                                    }`
                                                }
                                                {...register(
                                                    "password",
                                                    {
                                                        required:
                                                            "Lozinka je obavezna."
                                                    }
                                                )}
                                            />

                                            {errors.password && (

                                                <div className="invalid-feedback">
                                                    {errors.password.message}
                                                </div>

                                            )}

                                        </div>


                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100 py-2"
                                        >
                                            {isSubmitting
                                                ? "Prijavljivanje..."
                                                : "Prijavi se"}
                                        </button>

                                    </fieldset>

                                </form>


                                <hr className="my-4"/>


                                <p className="text-center text-secondary mb-0">

                                    Nemate nalog?{" "}

                                    <Link
                                        href="/user/create"
                                        className="fw-semibold text-decoration-none"
                                    >
                                        Registrujte se
                                    </Link>

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}