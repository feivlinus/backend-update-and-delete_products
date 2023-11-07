import useSWR, { mutate } from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import Comments from "../Comments";
import ProductForm from "../ProductForm";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useSWR(`/api/products/${id}`);
  async function handleEdit(event) {
    event.preventDefault();
    const updatedFormData = new FormData(event.target);
    const updatedData = Object.fromEntries(updatedFormData);
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      router.push("/");
    }
  }
  async function handleDelete() {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/");
    }
  }
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  return (
    <ProductCard>
      <h2>{data.name}</h2>
      <button
        onClick={() => {
          setIsEditMode(!isEditMode);
        }}
      >
        <span role="img" aria-label="A pencil">
          ✏️
        </span>
      </button>
      <button onClick={handleDelete} disabled={isEditMode}>
        <span role="img" aria-label="A cross indicating deletion">
          ❌
        </span>
      </button>
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>
      {isEditMode && (
        <ProductForm
          onSubmit={handleEdit}
          value={data}
          isEditMode={true}
        ></ProductForm>
      )}
      {data.reviews.length > 0 && <Comments reviews={data.reviews} />}

      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
