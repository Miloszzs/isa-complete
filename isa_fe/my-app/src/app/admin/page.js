'use client';

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {get, post, put, remove} from "@/core/httpClient";

export default function AdminPage() {

    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [productName, setProductName] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [adminUserId, setAdminUserId] = useState(null);

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
                return;
            }

            setAdminUserId(user.userId);

        } catch {
            router.replace("/login");
        }

    }, [router]);


    // =====================================================
    // UCITAVANJE PODATAKA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [productResponse, categoryResponse] =
                await Promise.all([
                    get("/product/get-product-list"),
                    get("/category/get-category-list")
                ]);

            setProducts(productResponse.data ?? []);
            setCategories(categoryResponse.data ?? []);

        } catch (error) {

            console.error(error);
            setError("Nije moguce ucitati podatke.");

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        if (adminUserId !== null) {
            loadData();
        }

    }, [adminUserId]);


    // =====================================================
    // MAPA KATEGORIJA
    // =====================================================

    const categoryMap = useMemo(() => {

        return new Map(
            categories.map(category => [
                category.id,
                category.name
            ])
        );

    }, [categories]);


    // =====================================================
    // FORMA
    // =====================================================

    const resetForm = () => {

        setProductName("");
        setSelectedCategories([]);
        setEditingId(null);
    };


    const handleCategoryChange = (categoryId) => {

        setSelectedCategories(current => {

            if (current.includes(categoryId)) {

                return current.filter(
                    id => id !== categoryId
                );
            }

            return [
                ...current,
                categoryId
            ];
        });
    };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (!productName.trim()) {

            setError("Naziv proizvoda je obavezan.");
            return;
        }

        const productData = {

            name: productName.trim(),

            userId: adminUserId,

            categoryIds: selectedCategories
        };

        try {

            if (editingId === null) {

                await post(
                    "/product/create-product-body",
                    productData
                );

                setMessage(
                    "Proizvod je uspesno dodat."
                );

            } else {

                await put(
                    `/product/${editingId}`,
                    productData
                );

                setMessage(
                    "Proizvod je uspesno izmenjen."
                );
            }

            resetForm();

            await loadData();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 403) {

                setError(
                    "Nemate dozvolu za ovu operaciju."
                );

            } else {

                setError(
                    error.response?.data ||
                    "Operacija nije uspela."
                );
            }
        }
    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (product) => {

        setEditingId(product.id);

        setProductName(product.name);

        setSelectedCategories(
            product.categoryIds ?? []
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (product) => {

        const confirmed = window.confirm(
            `Da li zelite da obrisete proizvod "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setMessage("");
            setError("");

            await remove(
                `/product/${product.id}`
            );

            setMessage(
                "Proizvod je uspesno obrisan."
            );

            if (editingId === product.id) {
                resetForm();
            }

            await loadData();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Brisanje proizvoda nije uspelo."
            );
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


    // =====================================================
    // HTML
    // =====================================================

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
                            href="/admin/categories"
                            className="btn btn-outline-light"
                        >
                            Kategorije
                        </Link>

                        <Link
                            href="/"
                            className="btn btn-outline-light"
                        >
                            Prodavnica
                        </Link>

                        <Link
                            href="/user/list"
                            className="btn btn-outline-light"
                        >
                            Korisnici
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
                    Administracija proizvoda
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
                                ? "Dodavanje proizvoda"
                                : "Izmena proizvoda"}

                        </h2>


                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label
                                    htmlFor="productName"
                                    className="form-label"
                                >
                                    Naziv proizvoda
                                </label>

                                <input
                                    id="productName"
                                    type="text"
                                    className="form-control"
                                    value={productName}
                                    onChange={event =>
                                        setProductName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="npr. Brazil Santos Arabica 500g"
                                />

                            </div>


                            <div className="mb-4">

                                <label className="form-label">
                                    Kategorije
                                </label>


                                {categories.length === 0 ? (

                                    <div className="alert alert-warning">
                                        Nema dostupnih kategorija.
                                    </div>

                                ) : (

                                    categories.map(category => (

                                        <div
                                            className="form-check"
                                            key={category.id}
                                        >

                                            <input
                                                id={`category-${category.id}`}
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={
                                                    selectedCategories.includes(
                                                        category.id
                                                    )
                                                }
                                                onChange={() =>
                                                    handleCategoryChange(
                                                        category.id
                                                    )
                                                }
                                            />

                                            <label
                                                className="form-check-label"
                                                htmlFor={
                                                    `category-${category.id}`
                                                }
                                            >
                                                {category.name}
                                            </label>

                                        </div>

                                    ))
                                )}

                            </div>


                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >

                                    {editingId === null
                                        ? "Dodaj proizvod"
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


                {/* TABELA */}

                <h2 className="h3 mb-3">
                    Lista proizvoda
                </h2>


                {loading ? (

                    <div className="alert alert-info">
                        Ucitavanje proizvoda...
                    </div>

                ) : products.length === 0 ? (

                    <div className="alert alert-secondary">
                        Trenutno nema proizvoda.
                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-striped table-hover align-middle">

                            <thead>

                            <tr>
                                <th>ID</th>
                                <th>Naziv proizvoda</th>
                                <th>Kategorije</th>
                                <th>Akcije</th>
                            </tr>

                            </thead>


                            <tbody>

                            {products.map(product => {

                                const productCategories =
                                    product.categoryIds
                                        ?.map(id =>
                                            categoryMap.get(id)
                                        )
                                        .filter(Boolean)
                                        .join(", ");

                                return (

                                    <tr key={product.id}>

                                        <td>
                                            {product.id}
                                        </td>

                                        <td>
                                            {product.name}
                                        </td>

                                        <td>

                                            {productCategories ||
                                                "Bez kategorije"}

                                        </td>

                                        <td>

                                            <div className="d-flex gap-2">

                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                >
                                                    Izmeni
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(product)
                                                    }
                                                >
                                                    Obrisi
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );
                            })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </main>
    );
}