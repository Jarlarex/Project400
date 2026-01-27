"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import { useMarketplace } from "@/hooks/useMarketplace";
import { uploadListingToIPFS } from "@/lib/ipfs";

export default function CreateListingPage() {
  const router = useRouter();
  const { isConnected, connect } = useWallet();
  const { createListing, isLoading, error, resetError } = useMarketplace();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isAuction: false,
    duration: "86400", // 1 day in seconds
    category: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    setUploadError(null);

    if (!imageFile) {
      setUploadError("Please select an image");
      return;
    }

    if (!formData.name || !formData.description || !formData.price) {
      setUploadError("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    try {
      // Upload to IPFS
      console.log("Uploading to IPFS...");
      const { metadataUri } = await uploadListingToIPFS(
        formData.name,
        formData.description,
        imageFile,
        formData.category
      );
      console.log("IPFS upload successful:", metadataUri);

      // Create listing on chain
      console.log("Creating listing on blockchain...");
      const listingId = await createListing(
        metadataUri,
        formData.price,
        formData.isAuction,
        formData.isAuction ? parseInt(formData.duration) : 0
      );

      console.log("Listing created with ID:", listingId?.toString());

      if (listingId !== null) {
        console.log("Redirecting to listing page...");
        router.push(`/listing/${listingId.toString()}`);
      } else {
        setUploadError("Listing created but ID could not be retrieved. Check your profile page.");
      }
    } catch (err: any) {
      console.error("Error creating listing:", err);
      setUploadError(err.message || "Failed to create listing");
    } finally {
      setIsUploading(false);
    }
  };

  const durationOptions = [
    { value: "3600", label: "1 Hour" },
    { value: "86400", label: "1 Day" },
    { value: "259200", label: "3 Days" },
    { value: "604800", label: "7 Days" },
    { value: "1209600", label: "14 Days" },
    { value: "2592000", label: "30 Days" },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00d4aa]/20 to-[#7c3aed]/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[var(--accent-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            You need to connect your wallet to create a listing on the marketplace.
          </p>
          <button onClick={connect} className="btn-primary">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Create Listing</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          List your item for sale or auction on the blockchain
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Item Image *</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                imagePreview
                  ? "border-[var(--accent-primary)]"
                  : "border-[var(--border-color)] hover:border-[var(--border-color-light)]"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-[var(--text-muted)] mt-4">
                    Click or drag to replace
                  </p>
                </div>
              ) : (
                <div>
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-medium mb-1">Click or drag to upload</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              className="input"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your item in detail"
              rows={4}
              className="input resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
            >
              <option value="">Select a category</option>
              <option value="art">Art</option>
              <option value="collectibles">Collectibles</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="gaming">Gaming</option>
              <option value="music">Music</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Listing Type Toggle */}
          <div>
            <label className="block text-sm font-medium mb-4">Listing Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isAuction: false })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !formData.isAuction
                    ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                    : "border-[var(--border-color)] hover:border-[var(--border-color-light)]"
                }`}
              >
                <svg
                  className={`w-8 h-8 mx-auto mb-2 ${
                    !formData.isAuction ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <p className="font-medium">Fixed Price</p>
                <p className="text-xs text-[var(--text-muted)]">Sell at a set price</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isAuction: true })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.isAuction
                    ? "border-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10"
                    : "border-[var(--border-color)] hover:border-[var(--border-color-light)]"
                }`}
              >
                <svg
                  className={`w-8 h-8 mx-auto mb-2 ${
                    formData.isAuction ? "text-[var(--accent-secondary)]" : "text-[var(--text-muted)]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium">Auction</p>
                <p className="text-xs text-[var(--text-muted)]">Accept bids over time</p>
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {formData.isAuction ? "Starting Price" : "Price"} (ETH) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="input pr-16"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">
                ETH
              </span>
            </div>
          </div>

          {/* Auction Duration */}
          {formData.isAuction && (
            <div>
              <label className="block text-sm font-medium mb-2">Auction Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input"
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Errors */}
          {(error || uploadError) && (
            <div className="p-4 rounded-xl bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/20 text-[var(--accent-danger)]">
              {error || uploadError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {isLoading || isUploading ? (
              <>
                <span className="spinner" />
                {isUploading ? "Uploading to IPFS..." : "Creating listing..."}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Listing
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
