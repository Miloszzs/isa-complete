'use client';

import {post} from "@/core/httpClient";
import {useForm} from "react-hook-form";
import {Button, Col, Row} from "reactstrap";

export default function UserCreate() {

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        mode: "onSubmit",
    });

    const onSubmit = async (data) => {
        try {

            await post("/user/create-user-body", data);

            alert("Korisnik je uspesno registrovan.");

            reset();

        } catch (error) {

            console.error(
                "Greska pri registraciji:",
                error
            );

            alert("Registracija nije uspela.");
        }
    };

    return (
        <>
            <Row className="mb-3">

                <Col md="6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        {...register("firstName", {
                            required: "Ime je obavezno",
                            maxLength: 50,
                            minLength: 3,
                        })}
                    />

                    {errors.firstName && (
                        <span className="text-danger">
                            {errors.firstName.message}
                        </span>
                    )}
                </Col>

                <Col md="6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        {...register("lastName", {
                            required: "Prezime je obavezno",
                            maxLength: 50,
                            minLength: 3,
                        })}
                    />

                    {errors.lastName && (
                        <span className="text-danger">
                            {errors.lastName.message}
                        </span>
                    )}
                </Col>

            </Row>

            <Row className="mb-3">

                <Col md="6">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        {...register("email", {
                            required: "Mejl je obavezan",
                        })}
                    />

                    {errors.email && (
                        <span className="text-danger">
                            {errors.email.message}
                        </span>
                    )}
                </Col>

                <Col md="6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Phone number"
                        {...register("contactNumber", {
                            required:
                                "Broj telefona je obavezan",
                            pattern: {
                                value: /^[0-9]{9,13}$/,
                                message:
                                    "Broj telefona mora imati od 9 do 13 cifara",
                            },
                        })}
                    />

                    {errors.contactNumber && (
                        <span className="text-danger">
                            {errors.contactNumber.message}
                        </span>
                    )}
                </Col>

            </Row>

            <Row className="mb-3">

                <Col md="6">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        autoComplete="new-password"
                        {...register("password", {
                            required: "Lozinka je obavezna",
                            minLength: {
                                value: 8,
                                message:
                                    "Lozinka mora imati najmanje 8 karaktera",
                            },
                            maxLength: {
                                value: 72,
                                message:
                                    "Lozinka je predugacka",
                            },
                        })}
                    />

                    {errors.password && (
                        <span className="text-danger">
                            {errors.password.message}
                        </span>
                    )}
                </Col>

            </Row>

            <Row>
                <Col md="12">

                    <Button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Submit
                    </Button>

                </Col>
            </Row>
        </>
    );
}