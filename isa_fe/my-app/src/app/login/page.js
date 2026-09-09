'use client';

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {Button, Col, Row} from "reactstrap";
import {post} from "@/core/httpClient";

export default function Login() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        resetField,
        formState: {errors, isSubmitting}
    } = useForm({defaultValues: {email: "", password: ""}});

    const onSubmit = async (values) => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");

            const response = await post("/auth/login", {
                email: values.email.trim(),
                password: values.password
            });

            const {accessToken, userId, email, roles} = response.data;

            if (!accessToken || !Array.isArray(roles)) {
                setErrorMessage("Server nije vratio podatke potrebne za prijavu.");
                return;
            }

            sessionStorage.setItem(
                "user",
                JSON.stringify({userId, email, roles})
            );

            sessionStorage.setItem("accessToken", accessToken);
            resetField("password");

            if (roles.includes("ADMIN")) {
                router.replace("/user/list");
            } else {
                setSuccessMessage(`Uspešno ste prijavljeni kao ${email}.`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setErrorMessage("Pogrešan email ili lozinka.");
            } else if (error.response?.status === 400) {
                setErrorMessage("Proverite uneti email i lozinku.");
            } else {
                setErrorMessage("Prijava nije uspela. Pokušajte ponovo.");
            }
        }
    };

    return (
        <main className="container py-5">
            <Row className="justify-content-center">
                <Col xs="12" md="6" lg="4">
                    <h1 className="h3 mb-4">Prijava</h1>

                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success" role="status">
                            <p>{successMessage}</p>

                            <Button
                                color="secondary"
                                outline
                                onClick={() => {
                                    sessionStorage.removeItem("accessToken");
                                    sessionStorage.removeItem("user");
                                    window.location.replace("/login");
                                }}
                            >
                                Odjavi se
                            </Button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <fieldset disabled={isSubmitting}>
                            <div className="mb-3">
                                <label
                                    htmlFor="email"
                                    className="form-label"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    className="form-control"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email ? "email-error" : undefined
                                    }
                                    {...register("email", {
                                        required: "Email je obavezan."
                                    })}
                                />

                                {errors.email && (
                                    <div
                                        id="email-error"
                                        className="text-danger mt-1"
                                    >
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Lozinka
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="form-control"
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={
                                        errors.password ? "password-error" : undefined
                                    }
                                    {...register("password", {
                                        required: "Lozinka je obavezna."
                                    })}
                                />

                                {errors.password && (
                                    <div
                                        id="password-error"
                                        className="text-danger mt-1"
                                    >
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>

                            <Button
                                color="primary"
                                type="submit"
                                className="w-100"
                            >
                                {isSubmitting ? "Prijavljivanje…" : "Prijavi se"}
                            </Button>
                        </fieldset>
                    </form>

                    <p className="mt-3 mb-0">
                        Nemate nalog?{" "}
                        <Link href="/user/create">
                            Registrujte se
                        </Link>
                    </p>
                </Col>
            </Row>
        </main>
    );
}