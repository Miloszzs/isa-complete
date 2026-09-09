'use client';

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {get} from "@/core/httpClient";
import {
  addToCart,
  getCartCount
} from "@/core/cart";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {

    let active = true;

    const loadData = async () => {

      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] =
            await Promise.all([
              get("/product/get-product-list"),
              get("/category/get-category-list")
            ]);

        if (!active) {
          return;
        }

        setProducts(productResponse.data ?? []);
        setCategories(categoryResponse.data ?? []);

      } catch (error) {

        console.error(error);

        if (active) {
          setError("Nije moguce ucitati proizvode.");
        }

      } finally {

        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };

  }, []);

  useEffect(() => {

    setCartCount(
        getCartCount()
    );

  }, []);

  useEffect(() => {

    const storedUser =
        sessionStorage.getItem("user");

    const token =
        sessionStorage.getItem("accessToken");

    if (!storedUser || !token) {
      return;
    }

    try {

      setCurrentUser(
          JSON.parse(storedUser)
      );

    } catch {

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
    }

  }, []);

  const categoryMap = useMemo(() => {

    return new Map(
        categories.map(category => [
          category.id,
          category.name
        ])
    );

  }, [categories]);

  const handleLogout = () => {

    sessionStorage.removeItem(
        "accessToken"
    );

    sessionStorage.removeItem(
        "user"
    );

    sessionStorage.removeItem(
        "coffeeShopCart"
    );

    setCurrentUser(null);
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

              {currentUser ? (
                  <>
                    {currentUser.roles?.includes("ADMIN") ? (

                        <Link
                            href="/admin"
                            className="btn btn-outline-light"
                        >
                          Admin panel
                        </Link>

                    ) : (

                        <>
                          <Link
                              href="/customer"
                              className="btn btn-outline-light"
                          >
                            Moj nalog
                          </Link>

                          <Link
                              href="/cart"
                              className="btn btn-outline-light"
                          >
                            Korpa ({cartCount})
                          </Link>
                        </>

                    )}

                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                      Odjavi se
                    </button>
                  </>

              ) : (

                  <Link
                      href="/login"
                      className="btn btn-outline-light"
                  >
                    Prijava
                  </Link>

              )}

            </div>

          </div>
        </nav>

        <section className="bg-light py-5">
          <div className="container text-center">

            <h1 className="display-5 fw-bold">
              Dobrodosli u Online Coffee Shop
            </h1>

            <p className="lead text-secondary mt-3">
              Pogledajte ponudu nasih proizvoda.
            </p>

          </div>
        </section>

        <section className="container py-5">

          <div className="mb-4">

            <h2 className="h3">
              Proizvodi
            </h2>

            <p className="text-secondary">
              Trenutna ponuda Coffee Shop-a
            </p>

          </div>

          {loading && (
              <div
                  className="alert alert-info"
                  role="status"
              >
                Ucitavanje proizvoda...
              </div>
          )}

          {error && (
              <div
                  className="alert alert-danger"
                  role="alert"
              >
                {error}
              </div>
          )}

          {!loading && !error && products.length === 0 && (
              <div className="alert alert-secondary">
                Trenutno nema proizvoda u ponudi.
              </div>
          )}

          {cartMessage && (

              <div className="alert alert-success">

                {cartMessage}

              </div>

          )}

          <div className="row g-4">

            {products.map(product => {

              const productCategories =
                  product.categoryIds
                      ?.map(id => categoryMap.get(id))
                      .filter(Boolean) ?? [];

              const handleAddToCart = (product) => {

                if (!currentUser) {

                  setCartMessage(
                      "Morate biti prijavljeni kao kupac da biste dodali proizvod u korpu."
                  );

                  return;
                }

                if (currentUser.roles?.includes("ADMIN")) {

                  setCartMessage(
                      "Administratorski nalog sluzi za upravljanje prodavnicom."
                  );

                  return;
                }

                if (!currentUser.roles?.includes("CUSTOMER")) {

                  return;
                }

                addToCart(product);

                setCartCount(
                    getCartCount()
                );

                setCartMessage(
                    `${product.name} je dodat u korpu.`
                );
              };

              return (
                  <div
                      className="col-12 col-md-6 col-lg-4"
                      key={product.id}
                  >

                    <div className="card h-100 shadow-sm">

                      <div className="card-body">

                        <h3 className="card-title h4">
                          {product.name}
                        </h3>

                        <p className="fs-5 fw-bold mb-3">
                          {Number(product.price).toLocaleString("sr-RS")} RSD
                        </p>

                        <p className="card-text text-secondary mb-2">
                          Kategorije:
                        </p>

                        {productCategories.length > 0 ? (

                            <div className="d-flex flex-wrap gap-2">

                              {productCategories.map(category => (
                                  <span
                                      key={category}
                                      className="badge text-bg-secondary"
                                  >
                                                        {category}
                                                    </span>
                              ))}

                            </div>

                        ) : (

                            <span className="text-secondary">
                                                Bez kategorije
                                            </span>

                        )}

                        {currentUser &&
                            currentUser.roles?.includes("CUSTOMER") &&
                            !currentUser.roles?.includes("ADMIN") && (

                                <div className="mt-4">

                                  <button
                                      type="button"
                                      className="btn btn-primary w-100"
                                      onClick={() =>
                                          handleAddToCart(product)
                                      }
                                  >
                                    Dodaj u korpu
                                  </button>

                                </div>
                            )}

                      </div>

                    </div>

                  </div>
              );
            })}

          </div>

        </section>

      </main>
  );
}