"use client";

import { FormEventHandler, useState } from "react";
import { createProduct } from "../../../lib/api";

export default function ProductImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target as HTMLFormElement);
    try {
      await createProduct(formData);
      setSuccess(true);
    } catch (error) {
      console.error("Produkt skapande misslyckades:", error);
      setError("Misslyckades att skapa produkt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lägg till ny produkt</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input type="text" name="name" placeholder="Produktnamn" className="input input-bordered w-full" required />
        <textarea name="description" placeholder="Produktbeskrivning" className="textarea textarea-bordered w-full" required />
        <input type="number" name="price" placeholder="Pris (SEK)" className="input input-bordered w-full" required />
        <input type="number" name="stock" placeholder="Antal i lager" className="input input-bordered w-full" required />
        <select name="category" className="select select-bordered w-full" required>
          <option value="">Välj kategori</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
        <input type="file" name="image" accept="image/*" className="input input-bordered w-full" />

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Lägger till produkt..." : "Lägg till produkt"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Produkten har skapats!</p>}
      </form>
    </div>
  );
}
