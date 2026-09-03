import { Product } from "../../domain/entities";
import { ProductCatalogRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

export class SupabaseProductCatalogRepository implements ProductCatalogRepository {
  async listAll(workspaceId: string): Promise<Product[] | { error: string }> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("product_catalog")
      .select("id, shopify_product_id, title, status, description, colors, sizes")
      .eq("workspace_id", workspaceId)
      .order("title", { ascending: true });

    if (error) return { error: `Failed to load product catalog: ${error.message}` };

    return (data ?? []).map((row) => ({
      id: row.id,
      shopifyProductId: row.shopify_product_id,
      title: row.title,
      status: row.status as Product["status"],
      description: row.description,
      colors: row.colors ?? [],
      sizes: row.sizes ?? [],
    }));
  }
}
