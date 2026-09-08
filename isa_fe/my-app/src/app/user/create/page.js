'use client';
import {post} from "@/core/httpClient";
import {useForm} from "react-hook-form";
import {Button, Col, Row} from "reactstrap";
export default function UserCreate() {
    const {
        register,
        watch,
        handleSubmit,
        formState: {errors}
    }  = useForm ({
        mode: 'onSubmit',
    });
    console.log(watch())

    return (
        <>
            <Row className="mb-3">
                <Col md={6}>
                    <input type="text" className="form-control" placeholder="First Name" {...register("firstName", {
                        required: "Ime je obavezno",
                        maxLength: 50,
                        minLength: 3,
                    })}/>
                    {errors && errors.firstName && (
                        <span className="text-danger">{errors.firstName.message}</span>
                    )}
                </Col>
                <Col md={6}>
                    <input type="text" className="form-control" placeholder="Last Name" {...register("lastName", {
                        required: "Prezime je obavezno",
                        maxLength: 50,
                        minLength: 3,
                    })}/>
                    {errors && errors.lastName && (
                        <span className="text-danger">{errors.lastName.message}</span>
                    )}
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <input type="email" className="form-control" placeholder="Email" {...register("email", {
                        required: "Mejl je obavezan",
                    })}/>
                    {errors && errors.email && (
                        <span className="text-danger">{errors.email.message}</span>
                    )}
                </Col>
                <Col md={6}>
                    <input type="text" className="form-control" placeholder="Phone number" {...register("contactNumber", {
                        required: "Broj telefona je obavezan",
                        maxLength: 15,
                        minLength: 8,
                        validate: (value) => {
                            if (!/^[0-9]+$/.test(value)) {
                                return "Netacan broj telefona";
                            }
                        }
                    })}/>
                    {errors && errors.contactNumber && (
                        <span className="text-danger">{errors.contactNumber.message}</span>
                    )}
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <Button className="btn btn-primary" type="button" onClick={() => {
                        handleSubmit(async (data) => {
                            await post("/user/create-user-body", data)
                        })();
                    }}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </>
    )
}