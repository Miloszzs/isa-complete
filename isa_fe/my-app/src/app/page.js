'use client';

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {get} from "@/core/httpClient";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const categoryMap = useMemo(() => {

    return new Map(
        categories.map(category => [
          category.id,
          category.name
        ])
    );

  }, [categories]);

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
                  href="/login"
                  className="btn btn-outline-light"
              >
                Prijava
              </Link>

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

          <div className="row g-4">

            {products.map(product => {

              const productCategories =
                  product.categoryIds
                      ?.map(id => categoryMap.get(id))
                      .filter(Boolean) ?? [];

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