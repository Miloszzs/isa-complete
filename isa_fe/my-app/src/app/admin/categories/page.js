'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {get, post, put, remove} from "@/core/httpClient";

export default function CategoriesAdminPage() {

    const router = useRouter();

    const [categories, setCategories] = useState([]);

    const [categoryName, setCategoryName] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // PROVERA ADMIN KORISNIKA
    // =====================================================

    useEffect(() => {

        const token = sessionStorage.getItem("accessToken");
        const storedUser = sessionStorage.getItem("user");

        if (!token || !storedUser) {
            router.replace("/login");
            return;
        }

        try {

            const user = JSON.parse(storedUser);

            if (!user.roles?.includes("ADMIN")) {
                router.replace("/");
            }

        } catch {
            router.replace("/login");
        }

    }, [router]);


    // =====================================================
    // UCITAVANJE KATEGORIJA
    // =====================================================

    const loadCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await get(
                "/category/get-category-list"
            );

            setCategories(response.data ?? []);

        } catch (error) {

            console.error(error);
            setError("Nije moguce ucitati kategorije.");

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadCategories();
    }, []);


    // =====================================================
    // RESET FORME
    // =====================================================

    const resetForm = () => {

        setCategoryName("");
        setEditingId(null);
    };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (!categoryName.trim()) {

            setError("Naziv kategorije je obavezan.");
            return;
        }

        const categoryData = {
            name: categoryName.trim()
        };

        try {

            if (editingId === null) {

                await post(
                    "/category/create-category-body",
                    categoryData
                );

                setMessage(
                    "Kategorija je uspesno dodata."
                );

            } else {

                await put(
                    `/category/${editingId}`,
                    categoryData
                );

                setMessage(
                    "Kategorija je uspesno izmenjena."
                );
            }

            resetForm();
            await loadCategories();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Operacija nad kategorijom nije uspela."
            );
        }
    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (category) => {

        setEditingId(category.id);
        setCategoryName(category.name);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (category) => {

        const confirmed = window.confirm(
            `Da li zelite da obrisete kategoriju "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setMessage("");
            setError("");

            await remove(
                `/category/${category.id}`
            );

            setMessage(
                "Kategorija je uspesno obrisana."
            );

            if (editingId === category.id) {
                resetForm();
            }

            await loadCategories();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 409) {

                setError(
                    "Kategorija ne moze biti obrisana jer je povezana sa proizvodima."
                );

            } else {

                setError(
                    error.response?.data ||
                    "Brisanje kategorije nije uspelo."
                );
            }
        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");

        router.replace("/login");
    };


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
                            href="/admin"
                            className="btn btn-outline-light"
                        >
                            Proizvodi
                        </Link>

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
                    Administracija kategorija
                </h1>


                {message && (

                    <div className="alert alert-success">
                        {message}
                    </div>

                )}


                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {/* FORMA */}

                <div className="card shadow-sm mb-5">

                    <div className="card-body">

                        <h2 className="h4 mb-4">

                            {editingId === null
                                ? "Dodavanje kategorije"
                                : "Izmena kategorije"}

                        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label
                                    htmlFor="categoryName"
                                    className="form-label"
                                >
                                    Naziv kategorije
                                </label>

                                <input
                                    id="categoryName"
                                    type="text"
                                    className="form-control"
                                    value={categoryName}
                                    onChange={event =>
                                        setCategoryName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="npr. Specialty kafa"
                                />

                            </div>


                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >

                                    {editingId === null
                                        ? "Dodaj kategoriju"
                                        : "Sacuvaj izmene"}

                                </button>


                                {editingId !== null && (

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Otkazi
                                    </button>

                                )}

                            </div>

                        </form>

                    </div>

                </div>


                {/* LISTA */}

                <h2 className="h3 mb-3">
                    Lista kategorija
                </h2>


                {loading ? (

                    <div className="alert alert-info">
                        Ucitavanje kategorija...
                    </div>

                ) : categories.length === 0 ? (

                    <div className="alert alert-secondary">
                        Trenutno nema kategorija.
                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-striped table-hover align-middle">

                            <thead>

                            <tr>
                                <th>ID</th>
                                <th>Naziv kategorije</th>
                                <th>Akcije</th>
                            </tr>

                            </thead>

                            <tbody>

                            {categories.map(category => (

                                <tr key={category.id}>

                                    <td>
                                        {category.id}
                                    </td>

                                    <td>
                                        {category.name}
                                    </td>

                                    <td>

                                        <div className="d-flex gap-2">

                                            <button
                                                type="button"
                                                className="btn btn-warning btn-sm"
                                                onClick={() =>
                                                    handleEdit(category)
                                                }
                                            >
                                                Izmeni
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(category)
                                                }
                                            >
                                                Obrisi
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </main>
    );
}