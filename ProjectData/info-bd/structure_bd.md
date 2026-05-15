## Table `attribute_values`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `attribute_id` | `int8` |  |
| `value` | `varchar` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `attributes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `name` | `varchar` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `cart-items`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `user_id` | `uuid` |  |
| `product_variant_id` | `int8` |  |
| `created_at` | `timestamptz` |  |
| `quantify` | `int4` |  |

## Table `categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `name` | `varchar` |  |
| `description` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |
| `image_url` | `text` |  Nullable |

## Table `materials`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `name` | `varchar` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `municipalities`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `name` | `varchar` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `order_items`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `order_id` | `int8` |  |
| `variant_id` | `int8` |  |
| `quantity` | `int4` |  |
| `unit_price` | `numeric` |  |
| `created_at` | `timestamptz` |  Nullable |
| `variant_snapshot` | `jsonb` |  Nullable |
| `product_snapshot` | `jsonb` |  Nullable |

## Table `orders`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `user_id` | `uuid` |  |
| `order_date` | `timestamptz` |  |
| `payment_status` | `varchar` |  |
| `shipping_status` | `varchar` |  |
| `total_amount` | `numeric` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `product_images`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `product_id` | `int8` |  |
| `variant_id` | `int8` |  |
| `image_url` | `text` |  |
| `is_primary` | `bool` |  |
| `display_order` | `int4` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `product_variants`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `product_id` | `int8` |  |
| `sku` | `varchar` |  Unique |
| `specific_price` | `numeric` |  |
| `stock` | `int4` |  |
| `created_at` | `timestamptz` |  Nullable |
| `is_active` | `bool` |  |

## Table `products`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `name` | `varchar` |  |
| `short_description` | `varchar` |  |
| `long_description` | `text` |  Nullable |
| `category_id` | `int8` |  |
| `material_id` | `int8` |  Nullable |
| `municipality_id` | `int8` |  |
| `created_at` | `timestamptz` |  Nullable |
| `notes` | `varchar` |  |
| `dimensions` | `varchar` |  |
| `updated_at` | `date` |  Nullable |
| `activo` | `bool` |  |

## Table `roles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `name` | `varchar` |  Unique |
| `description` | `text` |  Nullable |

## Table `users`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `first_name` | `varchar` |  |
| `last_name` | `varchar` |  Nullable |
| `email` | `varchar` |  Unique |
| `phone` | `varchar` |  Nullable |
| `shipping_address` | `text` |  Nullable |
| `created_at` | `timestamptz` |  |
| `role_id` | `int8` |  |
| `avatar` | `text` |  Nullable |

## Table `variant_values`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `variant_id` | `int8` | Primary |
| `attribute_value_id` | `int8` | Primary |

## Table `wish_list`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `product_id` | `int8` |  |
| `user_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

