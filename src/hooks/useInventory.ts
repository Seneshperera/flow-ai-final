"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInventoryStore, Product } from "@/store/useInventoryStore";
import { getInventoryAction, addProductAction, updateProductAction, deleteProductAction } from "@/actions/inventory.actions";

export function useInventory() {
  const queryClient = useQueryClient();
  const store = useInventoryStore();

  // Fetch logic from DB
  const { data: serverProducts, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await getInventoryAction();
      if (!res.success) throw new Error(res.error);
      
      // Update Zustand store so UI can search/filter immediately
      useInventoryStore.setState({ products: res.data || [] });
      
      return res.data;
    },
  });

  // Add Product Mutation
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, "id">) => {
      const res = await addProductAction(newProduct);
      if (!res.success) throw new Error(res.error);
      return res.data as Product;
    },
    onSuccess: (addedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  // Edit Product Mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Product> }) => {
      const res = await updateProductAction(id, data);
      if (!res.success) throw new Error(res.error);
      return { id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteProductAction(id);
      if (!res.success) throw new Error(res.error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  return {
    products: serverProducts,
    isLoading,
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isAdding: addProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
}
