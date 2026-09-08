'use client';

import {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {Button, Col, Row} from "reactstrap";
import {get, put} from "@/core/httpClient";

export default function UserEdit() {

    const params = useParams();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        mode: "onSubmit"
    });

    useEffect(() => {

        const loadUser = async () => {
            try {
                const response = await get(`/user/${params.id}`);

                reset(response.data);
            } catch (error) {
                console.error("Greska pri ucitavanju korisnika:", error);
            }
        };

        if (params.id) {
            loadUser();
        }

    }, [params.id, reset]);

    const onSubmit = async (data) => {

        try {
            await put(`/user/${params.id}`, data);

            router.push("/user/list");
        } catch (error) {
            console.error("Greska pri izmeni korisnika:", error);
        }
    };

    return (
        <>
            <h2 className="mb-4">Edit User</h2>

            <Row className="mb-3">
                <Col md="6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        {...register("firstName", {
                            required: "Ime je obavezno",
                            minLength: {
                                value: 3,
                                message: "Ime mora imati najmanje 3 karaktera"
                            },
                            maxLength: {
                                value: 50,
                                message: "Ime može imati najviše 50 karaktera"
                            }
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
                            minLength: {
                                value: 3,
                                message: "Prezime mora imati najmanje 3 karaktera"
                            },
                            maxLength: {
                                value: 50,
                                message: "Prezime može imati najviše 50 karaktera"
                            }
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
                            required: "Mejl je obavezan"
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
                            required: "Broj telefona je obavezan",
                            pattern: {
                                value: /^[0-9]{9,13}$/,
                                message: "Broj telefona mora imati od 9 do 13 cifara"
                            }
                        })}
                    />

                    {errors.contactNumber && (
                        <span className="text-danger">
                            {errors.contactNumber.message}
                        </span>
                    )}
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Button
                        color="primary"
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save Changes
                    </Button>
                </Col>
            </Row>
        </>
    );
}