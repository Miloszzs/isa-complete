const CART_KEY = "coffeeShopCart";


export const getCart = () => {

    if (typeof window === "undefined") {
        return [];
    }

    try {

        const cart = sessionStorage.getItem(CART_KEY);

        return cart
            ? JSON.parse(cart)
            : [];

    } catch {

        return [];
    }
};


export const saveCart = (cart) => {

    if (typeof window === "undefined") {
        return;
    }

    sessionStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
};


export const addToCart = (product) => {

    const cart = getCart();

    const existingItem = cart.find(
        item => item.productId === product.id
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1
        });
    }

    saveCart(cart);

    return cart;
};


export const getCartCount = () => {

    return getCart().reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
};


export const clearCart = () => {

    if (typeof window === "undefined") {
        return;
    }

    sessionStorage.removeItem(CART_KEY);
};