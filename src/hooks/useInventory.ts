"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInventoryStore, Product } from "@/store/useInventoryStore";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useInventory() {
  const queryClient = useQueryClient();
  const store = useInventoryStore();

  // Fetch logic (simulated)
  const { data: serverProducts, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      await delay(800); // Simulate network
      return store.products;
    },
    initialData: store.products,
  });

  // Add Product Mutation
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, "id">) => {
      await delay(1000); // Simulate API call
      return { ...newProduct, id: Math.random().toString(36).substr(2, 9) } as Product;
    },
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['inventory']);
      
      // Optimistic update
      const optimisticProduct = { ...newProduct, id: 'temp-id' } as Product;
      queryClient.setQueryData<Product[]>(['inventory'], (old) => [optimisticProduct, ...(old || [])]);
      
      // Update Zustand store for immediate UI reflection
      store.addProduct(newProduct);

      return { previousProducts };
    },
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(['inventory'], context?.previousProducts);
      // Rollback Zustand logic here if needed
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  // Edit Product Mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Product> }) => {
      await delay(1000);
      return { id, data };
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['inventory']);

      queryClient.setQueryData<Product[]>(['inventory'], (old) => 
        old?.map(p => p.id === id ? { ...p, ...data } : p)
      );

      store.updateProduct(id, data);
      return { previousProducts };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await delay(1000);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['inventory']);

      queryClient.setQueryData<Product[]>(['inventory'], (old) => 
        old?.filter(p => p.id !== id)
      );

      store.deleteProduct(id);
      return { previousProducts };
    },
    onSettled: () => {
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
