'use client';

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {post} from "@/core/httpClient";

export default function UserCreate() {

    const router = useRouter();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm({
        mode: "onSubmit"
    });


    const onSubmit = async (data) => {

        setSuccessMessage("");
        setErrorMessage("");

        try {

            await post(
                "/user/create-user-body",
                data
            );

            setSuccessMessage(
                "Registracija je uspesna. Sada se mozete prijaviti."
            );

            reset();

        } catch (error) {

            console.error(
                "Greska pri registraciji:",
                error
            );

            setErrorMessage(
                error.response?.data ||
                "Registracija nije uspela. Pokusajte ponovo."
            );
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
                        href="/login"
                        className="btn btn-outline-light"
                    >
                        Prijava
                    </Link>

                </div>

            </nav>


            {/* REGISTRACIJA */}

            <div className="container py-5">

                <div className="row justify-content-center">

                    <div className="col-12 col-lg-8 col-xl-7">

                        <div className="text-center mb-4">

                            <div
                                className="display-4 mb-2"
                                aria-hidden="true"
                            >
                                ☕
                            </div>

                            <h1 className="h2 fw-bold">
                                Kreirajte nalog
                            </h1>

                            <p className="text-secondary">
                                Registrujte se i porucujte omiljenu kafu
                            </p>

                        </div>


                        <div className="card border-0 shadow">

                            <div className="card-body p-4 p-md-5">

                                <h2 className="h4 mb-4">
                                    Registracija korisnika
                                </h2>


                                {successMessage && (

                                    <div
                                        className="alert alert-success"
                                        role="status"
                                    >

                                        <div className="mb-2">
                                            {successMessage}
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                router.push("/login")
                                            }
                                        >
                                            Idi na prijavu
                                        </button>

                                    </div>

                                )}


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

                                        {/* IME + PREZIME */}

                                        <div className="row g-3 mb-3">

                                            <div className="col-12 col-md-6">

                                                <label
                                                    htmlFor="firstName"
                                                    className="form-label fw-semibold"
                                                >
                                                    Ime
                                                </label>

                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    placeholder="Unesite ime"
                                                    className={
                                                        `form-control ${
                                                            errors.firstName
                                                                ? "is-invalid"
                                                                : ""
                                                        }`
                                                    }
                                                    {...register(
                                                        "firstName",
                                                        {
                                                            required:
                                                                "Ime je obavezno",
                                                            minLength: {
                                                                value: 3,
                                                                message:
                                                                    "Ime mora imati najmanje 3 karaktera"
                                                            },
                                                            maxLength: {
                                                                value: 50,
                                                                message:
                                                                    "Ime moze imati najvise 50 karaktera"
                                                            }
                                                        }
                                                    )}
                                                />

                                                {errors.firstName && (

                                                    <div className="invalid-feedback">
                                                        {errors.firstName.message}
                                                    </div>

                                                )}

                                            </div>


                                            <div className="col-12 col-md-6">

                                                <label
                                                    htmlFor="lastName"
                                                    className="form-label fw-semibold"
                                                >
                                                    Prezime
                                                </label>

                                                <input
                                                    id="lastName"
                                                    type="text"
                                                    placeholder="Unesite prezime"
                                                    className={
                                                        `form-control ${
                                                            errors.lastName
                                                                ? "is-invalid"
                                                                : ""
                                                        }`
                                                    }
                                                    {...register(
                                                        "lastName",
                                                        {
                                                            required:
                                                                "Prezime je obavezno",
                                                            minLength: {
                                                                value: 3,
                                                                message:
                                                                    "Prezime mora imati najmanje 3 karaktera"
                                                            },
                                                            maxLength: {
                                                                value: 50,
                                                                message:
                                                                    "Prezime moze imati najvise 50 karaktera"
                                                            }
                                                        }
                                                    )}
                                                />

                                                {errors.lastName && (

                                                    <div className="invalid-feedback">
                                                        {errors.lastName.message}
                                                    </div>

                                                )}

                                            </div>

                                        </div>


                                        {/* EMAIL + TELEFON */}

                                        <div className="row g-3 mb-3">

                                            <div className="col-12 col-md-6">

                                                <label
                                                    htmlFor="email"
                                                    className="form-label fw-semibold"
                                                >
                                                    Email adresa
                                                </label>

                                                <input
                                                    id="email"
                                                    type="email"
                                                    autoComplete="email"
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
                                                                "Email je obavezan"
                                                        }
                                                    )}
                                                />

                                                {errors.email && (

                                                    <div className="invalid-feedback">
                                                        {errors.email.message}
                                                    </div>

                                                )}

                                            </div>


                                            <div className="col-12 col-md-6">

                                                <label
                                                    htmlFor="contactNumber"
                                                    className="form-label fw-semibold"
                                                >
                                                    Broj telefona
                                                </label>

                                                <input
                                                    id="contactNumber"
                                                    type="text"
                                                    placeholder="npr. 0611234567"
                                                    className={
                                                        `form-control ${
                                                            errors.contactNumber
                                                                ? "is-invalid"
                                                                : ""
                                                        }`
                                                    }
                                                    {...register(
                                                        "contactNumber",
                                                        {
                                                            required:
                                                                "Broj telefona je obavezan",
                                                            pattern: {
                                                                value:
                                                                    /^[0-9]{9,13}$/,
                                                                message:
                                                                    "Broj telefona mora imati od 9 do 13 cifara"
                                                            }
                                                        }
                                                    )}
                                                />

                                                {errors.contactNumber && (

                                                    <div className="invalid-feedback">
                                                        {errors.contactNumber.message}
                                                    </div>

                                                )}

                                            </div>

                                        </div>


                                        {/* LOZINKA */}

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
                                                autoComplete="new-password"
                                                placeholder="Najmanje 8 karaktera"
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
                                                            "Lozinka je obavezna",
                                                        minLength: {
                                                            value: 8,
                                                            message:
                                                                "Lozinka mora imati najmanje 8 karaktera"
                                                        },
                                                        maxLength: {
                                                            value: 72,
                                                            message:
                                                                "Lozinka je predugacka"
                                                        }
                                                    }
                                                )}
                                            />

                                            {errors.password && (

                                                <div className="invalid-feedback">
                                                    {errors.password.message}
                                                </div>

                                            )}

                                            <div className="form-text">
                                                Lozinka mora imati najmanje 8 karaktera.
                                            </div>

                                        </div>


                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100 py-2"
                                        >
                                            {isSubmitting
                                                ? "Registracija..."
                                                : "Registruj se"}
                                        </button>

                                    </fieldset>

                                </form>


                                <hr className="my-4"/>


                                <p className="text-center text-secondary mb-0">

                                    Vec imate nalog?{" "}

                                    <Link
                                        href="/login"
                                        className="fw-semibold text-decoration-none"
                                    >
                                        Prijavite se
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