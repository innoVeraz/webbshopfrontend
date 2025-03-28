"use client";

import { FormEventHandler, useState, ChangeEvent } from "react";
import { createProduct } from "../../../lib/api";
import Image from 'next/image';

export default function ProductImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target as HTMLFormElement);
    const imageFile = formData.get('image') as File;
    
    if (!imageFile || imageFile.size === 0) {
      setError("En bild måste laddas upp");
      setLoading(false);
      return;
    }

    try {
      await createProduct(formData);
      setSuccess(true);
      setImagePreview(null);
      (e.target as HTMLFormElement).reset();
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
        <div className="space-y-2">
          <input 
            type="file" 
            name="image" 
            accept="image/*"
            onChange={handleImageChange}
            className="input input-bordered w-full" 
            required 
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Förhandsvisning:</p>
              <Image 
                src={imagePreview} 
                alt="Preview" 
                width={320}
                height={240}
                className="h-auto rounded-lg shadow-sm" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Lägger till produkt..." : "Lägg till produkt"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Produkten har skapats!</p>}
      </form>
    </div>
  );
}
