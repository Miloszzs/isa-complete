'use client';

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {get, post, put, remove} from "@/core/httpClient";

export default function AdminPage() {

    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [categoryIds, setCategoryIds] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [adminUserId, setAdminUserId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        const storedUser = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("accessToken");

        if (!storedUser || !token) {
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
            setError("Greska pri ucitavanju podataka.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (adminUserId) {
            loadData();
        }

    }, [adminUserId]);

    const categoryMap = useMemo(() => {

        return new Map(
            categories.map(category => [
                category.id,
                category.name
            ])
        );

    }, [categories]);

    const resetForm = () => {
        setName("");
        setCategoryIds([]);
        setEditingId(null);
    };

    const handleCategoryChange = (id) => {

        setCategoryIds(current => {

            if (current.includes(id)) {
                return current.filter(categoryId => categoryId !== id);
            }

            return [...current, id];
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Naziv proizvoda je obavezan.");
            return;
        }

        const body = {
            name: name.trim(),
            userId: adminUserId,
            categoryIds: categoryIds
        };

        try {

            if (editingId === null) {

                await post(
                    "/product/create-product-body",
                    body
                );

                setMessage("Proizvod je uspesno dodat.");

            } else {

                await put(
                    `/product/${editingId}`,
                    body
                );

                setMessage("Proizvod je uspesno izmenjen.");
            }

            resetForm();
            await loadData();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 403) {
                setError("Nemate dozvolu za ovu operaciju.");
            } else {
                setError("Operacija nad proizvodom nije uspela.");
            }
        }
    };

    const handleEdit = (product) => {

        setEditingId(product.id);
        setName(product.name);
        setCategoryIds(product.categoryIds ?? []);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (productId) => {

        const confirmed = window.confirm(
            "Da li ste sigurni da zelite da obrisete proizvod?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setMessage("");
            setError("");

            await remove(`/product/${productId}`);

            if (editingId === productId) {
                resetForm();
            }

            setMessage("Proizvod je uspesno obrisan.");
            await loadData();

        } catch (error) {

            console.error(error);
            setError("Brisanje proizvoda nije uspelo.");
        }
    };

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

                <div className="card shadow-sm mb-5">

                    <div className="card-body">

                        <h2 className="h4 mb-4">
                            {editingId === null
                                ? "Dodaj proizvod"
                                : "Izmeni proizvod"}
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
                                    value={name}
                                    onChange={event =>
                                        setName(event.target.value)
                                    }
                                    placeholder="npr. Ethiopia Arabica 250g"
                                />

                            </div>

                            <div className="mb-4">

                                <label className="form-label">
                                    Kategorije
                                </label>

                                {categories.length === 0 ? (

                                    <div className="alert alert-warning">
                                        Trenutno nema kategorija.
                                    </div>

                                ) : (

                                    categories.map(category => (

                                        <div
                                            className="form-check"
                                            key={category.id}
                                        >

                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`category-${category.id}`}
                                                checked={
                                                    categoryIds.includes(
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

                <h2 className="h3 mb-3">
                    Proizvodi
                </h2>

                {loading ? (

                    <div className="alert alert-info">
                        Ucitavanje...
                    </div>

                ) : products.length === 0 ? (

                    <div className="alert alert-secondary">
                        Trenutno nema proizvoda.
                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-striped align-middle">

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Naziv</th>
                                <th>Kategorije</th>
                                <th>Akcije</th>
                            </tr>
                            </thead>

                            <tbody>

                            {products.map(product => {

                                const productCategories =
                                    product.categoryIds
                                        ?.map(id => categoryMap.get(id))
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
                                            {productCategories || "Bez kategorije"}
                                        </td>

                                        <td>

                                            <div className="d-flex gap-2">

                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                >
                                                    Izmeni
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(product.id)
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