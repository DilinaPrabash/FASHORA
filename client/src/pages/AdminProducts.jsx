
import { useEffect, useState } from "react";
import {
  Search,
  Package,
  Trash2,
  RefreshCw,
  Plus,
  X,
  ImagePlus,
  Pencil,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialForm = {
  name: "",
  category: "Women",
  price: "",
  description: "",
  sizes: "S, M, L, XL",
  stock: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch all admin products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/products/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Clear image preview
  const clearImagePreview = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setSelectedImage(null);
  };

  // Open Add Product Modal
  const openAddModal = () => {
    clearImagePreview();
    setEditingProduct(null);
    setFormData(initialForm);
    setFormError("");
    setShowModal(true);
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    clearImagePreview();

    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || "Women",
      price: product.price ?? "",
      description: product.description || "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : "",
      stock: product.stock ?? 0,
    });

    setPreviewUrl(product.image || "");
    setFormError("");
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    if (saving) return;

    clearImagePreview();
    setEditingProduct(null);
    setFormData(initialForm);
    setFormError("");
    setShowModal(false);
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormError("");

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload selected image to Supabase
  const uploadImage = async (token) => {
    if (!selectedImage) return null;

    setUploadingImage(true);

    const imageFormData = new FormData();
    imageFormData.append("image", selectedImage);

    const response = await fetch(
      `${API_URL}/products/upload-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    if (!data.imageUrl) {
      throw new Error("Image URL was not returned by the server.");
    }

    setUploadingImage(false);

    return data.imageUrl;
  };

  // Add or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProduct && !selectedImage) {
      setFormError("Please select a product image.");
      return;
    }

    if (editingProduct && !previewUrl) {
      setFormError("Please select a product image.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login as an admin.");
      }

      // Upload a new image only if selected
      let imageUrl = editingProduct
        ? editingProduct.image
        : null;

      if (selectedImage) {
        imageUrl = await uploadImage(token);
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        image: imageUrl,
        description: formData.description.trim(),
        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
        stock: Number(formData.stock),
      };

      // Update existing product or create new product
      const isEditing = Boolean(editingProduct);

      const url = isEditing
        ? `${API_URL}/products/${editingProduct._id}`
        : `${API_URL}/products`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Failed to update product"
              : "Failed to add product")
        );
      }

      // Reset modal
      clearImagePreview();
      setFormData(initialForm);
      setEditingProduct(null);
      setShowModal(false);

      // Refresh product list
      await fetchProducts();

      alert(
        isEditing
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString("en-LK")}`;

  return (
    <div className="text-white">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Product Management
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your store products and inventory.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#d6bd91] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#c5a875]"
          >
            <Plus size={18} />
            Add Product
          </button>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#d6bd91]/40 px-5 py-3 text-sm text-[#d6bd91] hover:bg-[#d6bd91] hover:text-black disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-xl border border-white/10 bg-[#151515] p-5">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-[#d6bd91]/10 p-3 text-[#d6bd91]">
            <Package size={25} />
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Total Products
            </p>

            <h2 className="text-2xl font-bold">
              {products.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-white/10 bg-[#151515] px-4 py-3">
        <Search size={19} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-48 items-center justify-center gap-3 text-gray-400">
          <RefreshCw size={20} className="animate-spin" />
          Loading products...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-center">
          <p className="mb-3 text-red-400">{error}</p>

          <button
            onClick={fetchProducts}
            className="rounded bg-[#d6bd91] px-5 py-2 font-medium text-black"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-[#151515] p-12 text-center">
          <Package
            size={40}
            className="mx-auto mb-4 text-gray-500"
          />

          <h3 className="text-lg font-semibold">
            No Products Found
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            No products match your search.
          </p>
        </div>
      )}

      {/* Products Table */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#151515]">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-white/10 bg-[#1c1c1c] text-gray-400">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-12 rounded object-cover"
                      />

                      <span className="font-medium">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-300">
                    {product.category}
                  </td>

                  <td className="px-5 py-4 text-[#d6bd91]">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-5 py-4">
                    {product.stock}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        product.isAvailable
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {product.isAvailable
                        ? "Available"
                        : "Out of Stock"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="rounded-lg p-2 text-[#d6bd91] transition hover:bg-[#d6bd91]/10"
                        title="Edit Product"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl border border-white/10 bg-[#151515] shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {editingProduct
                    ? "Update the product information."
                    : "Enter the product details below."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    placeholder="Elegant Summer Dress"
                    className="w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#d6bd91]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#d6bd91]"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Price (LKR) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="8500"
                    className="w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#d6bd91]"
                  />
                </div>

                {/* Product Image */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Product Image *
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-[#0b0b0b] p-6 transition hover:border-[#d6bd91]">
                    <ImagePlus
                      size={32}
                      className="mb-3 text-[#d6bd91]"
                    />

                    <span className="text-sm font-medium text-white">
                      {editingProduct
                        ? "Choose New Image (Optional)"
                        : "Choose Product Image"}
                    </span>

                    <span className="mt-1 text-xs text-gray-500">
                      JPG, PNG or WEBP (Maximum 5MB)
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={saving}
                      className="hidden"
                    />
                  </label>

                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-gray-400">
                        {selectedImage
                          ? "New Image Preview"
                          : "Current Product Image"}
                      </p>

                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Product preview"
                          className="h-40 w-32 rounded-lg border border-white/10 object-cover"
                        />

                        <button
                          type="button"
                          disabled={saving}
                          onClick={clearImagePreview}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white disabled:opacity-50"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {selectedImage && (
                        <p className="mt-2 text-xs text-gray-400">
                          {selectedImage.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    maxLength={2000}
                    placeholder="Write a description for this product..."
                    className="w-full resize-y rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#d6bd91]"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Available Sizes
                  </label>

                  <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleInputChange}
                    placeholder="S, M, L, XL"
                    className="w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#d6bd91]"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Separate sizes using commas.
                  </p>
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Stock Quantity *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1"
                    placeholder="20"
                    className="w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-[#d6bd91]"
                  />
                </div>
              </div>

              {/* Form Error */}
              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {formError}
                </div>
              )}

              {/* Upload Status */}
              {uploadingImage && (
                <div className="flex items-center gap-3 rounded-lg border border-[#d6bd91]/30 bg-[#d6bd91]/10 p-3 text-sm text-[#d6bd91]">
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                  Uploading image to Supabase...
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-white/20 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#d6bd91] px-6 py-3 text-sm font-semibold text-black hover:bg-[#c5a875] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? uploadingImage
                      ? "Uploading Image..."
                      : editingProduct
                        ? "Updating Product..."
                        : "Saving Product..."
                    : editingProduct
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
