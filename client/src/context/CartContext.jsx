
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("fashora-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("fashora-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product
  const addToCart = (product) => {
    const stock = Number(product.stock);
    const requestedQuantity = Number(product.quantity);

    if (
      !Number.isFinite(stock) ||
      stock <= 0 ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return {
        success: false,
        message: "This product is currently unavailable.",
      };
    }

    const existingProduct = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === product.selectedSize
    );

    const currentQuantity = existingProduct
      ? existingProduct.quantity
      : 0;

    const newQuantity = currentQuantity + requestedQuantity;

    if (newQuantity > stock) {
      return {
        success: false,
        message: `Only ${stock} items are available. You already have ${currentQuantity} in your cart.`,
      };
    }

    if (existingProduct) {
      setCartItems((previousItems) =>
        previousItems.map((item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      setCartItems((previousItems) => [
        ...previousItems,
        product,
      ]);
    }

    return {
      success: true,
      message: "Product added to cart successfully!",
    };
  };

  // Remove product
  const removeFromCart = (productId, selectedSize) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  // Update quantity
  const updateQuantity = (productId, selectedSize, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;

    setCartItems((previousItems) =>
      previousItems.map((item) => {
        if (
          item.id === productId &&
          item.selectedSize === selectedSize
        ) {
          const stock = Number(item.stock);

          if (!Number.isFinite(stock) || stock <= 0) {
            return item;
          }

          return {
            ...item,
            quantity: Math.min(quantity, stock),
          };
        }

        return item;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Cart count
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
